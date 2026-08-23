interface LimitStats {
  requestsThisMinute: number;
  tokensThisMinute: number;
  totalRequestsToday: number;
  totalTokensToday: number;
  lastResetTime: number;
}

// Enforcement caps. These protect the shared AI spend; keys are global because
// the API has no authenticated identity yet (documented audit decision).
export const RPM_LIMIT = 30;
export const TPM_LIMIT = 100_000;
export const DAILY_REQUEST_LIMIT = 1_000;

declare global {
  var __aslynx_limits_fallback__: LimitStats | undefined;
}

if (!globalThis.__aslynx_limits_fallback__) {
  globalThis.__aslynx_limits_fallback__ = {
    requestsThisMinute: 0,
    tokensThisMinute: 0,
    totalRequestsToday: 0,
    totalTokensToday: 0,
    lastResetTime: Date.now()
  };
}

const fallback = globalThis.__aslynx_limits_fallback__;

export function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/** Sends multiple commands in one REST round-trip (Upstash pipelining). */
async function callUpstashPipeline(commands: string[][]): Promise<unknown[] | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(5000)
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data.result) ? data.result : null;
}

function limitKeys(now = Date.now()) {
  const minuteBucket = Math.floor(now / 60000);
  const dayBucket = new Date(now).toISOString().slice(0, 10);
  return {
    rpmKey: `ratelimit:rpm:${minuteBucket}`,
    tpmKey: `ratelimit:tpm:${minuteBucket}`,
    dailyReqKey: `ratelimit:daily_req:${dayBucket}`,
    dailyTokenKey: `ratelimit:daily_tokens:${dayBucket}`
  };
}

interface LimitUsage {
  current: number;
  limit: number;
  percentage: number;
}

interface LimitSnapshot {
  rpm: LimitUsage;
  tpm: LimitUsage;
  dailyRequests: number;
  dailyTokens: number;
  status: 'healthy' | 'throttled' | 'critical' | 'blocked';
}

export interface RateLimitDecision {
  allowed: boolean;
  status: LimitSnapshot;
  reason?: 'rpm' | 'tpm' | 'daily';
}

type StatusSnapshot = {
  rpm: { current: number; limit: number; percentage: number };
  tpm: { current: number; limit: number; percentage: number };
  dailyRequests: number;
  dailyTokens: number;
  status: 'healthy' | 'throttled' | 'critical' | 'blocked';
};

function buildStatus(rpm: number, tpm: number, dailyReq: number, dailyTok: number): StatusSnapshot['status'] {
  const rpmPercent = Math.min(100, Math.round((rpm / RPM_LIMIT) * 100));
  const tpmPercent = Math.min(100, Math.round((tpm / TPM_LIMIT) * 100));
  if (rpm >= RPM_LIMIT || tpm >= TPM_LIMIT) return 'blocked';
  if (rpmPercent > 85 || tpmPercent > 85) return 'critical';
  if (rpmPercent > 50 || tpmPercent > 50) return 'throttled';
  return 'healthy';
}

/**
 * Checks current usage BEFORE an expensive provider call.
 * - Redis configured but unreachable -> fail CLOSED (protect API spend).
 * - Redis not configured -> enforce per-instance in-memory counters instead
 *   so local dev keeps working.
 */
export async function checkRateLimit(estimatedTokens: number): Promise<RateLimitDecision> {
  const { rpmKey, tpmKey, dailyReqKey } = limitKeys();

  if (isRedisConfigured()) {
    const results = await callUpstashPipeline([
      ['GET', rpmKey],
      ['GET', tpmKey],
      ['GET', dailyReqKey]
    ]);

    if (!results) {
      // Fail closed: we cannot verify budget, refuse the request.
      return {
        allowed: false,
        reason: 'daily',
        status: {
          rpm: { current: RPM_LIMIT, limit: RPM_LIMIT, percentage: 100 },
          tpm: { current: TPM_LIMIT, limit: TPM_LIMIT, percentage: 100 },
          dailyRequests: 0,
          dailyTokens: 0,
          status: 'blocked'
        }
      };
    }

    const rpm = coerceNumber(results[0]);
    const tpm = coerceNumber(results[1]);
    const dailyReq = coerceNumber(results[2]);
    const allowed = rpm < RPM_LIMIT && tpm + estimatedTokens <= TPM_LIMIT && dailyReq < DAILY_REQUEST_LIMIT;

    return {
      allowed,
      reason: !allowed ? (rpm >= RPM_LIMIT ? 'rpm' : dailyReq >= DAILY_REQUEST_LIMIT ? 'daily' : 'tpm') : undefined,
      status: {
        rpm: { current: rpm, limit: RPM_LIMIT, percentage: Math.min(100, Math.round((rpm / RPM_LIMIT) * 100)) },
        tpm: { current: tpm, limit: TPM_LIMIT, percentage: Math.min(100, Math.round((tpm / TPM_LIMIT) * 100)) },
        dailyRequests: dailyReq,
        dailyTokens: 0,
        status: buildStatus(rpm, tpm, dailyReq, 0)
      }
    };
  }

  // In-memory fallback enforcement
  resetFallbackWindowIfNeeded(Date.now());
  const allowed =
    fallback.requestsThisMinute < RPM_LIMIT &&
    fallback.tokensThisMinute + estimatedTokens <= TPM_LIMIT &&
    fallback.totalRequestsToday < DAILY_REQUEST_LIMIT;

  return {
    allowed,
    reason: !allowed
      ? fallback.requestsThisMinute >= RPM_LIMIT
        ? 'rpm'
        : fallback.totalRequestsToday >= DAILY_REQUEST_LIMIT
          ? 'daily'
          : 'tpm'
      : undefined,
    status: {
      rpm: { current: fallback.requestsThisMinute, limit: RPM_LIMIT, percentage: Math.min(100, Math.round((fallback.requestsThisMinute / RPM_LIMIT) * 100)) },
      tpm: { current: fallback.tokensThisMinute, limit: TPM_LIMIT, percentage: Math.min(100, Math.round((fallback.tokensThisMinute / TPM_LIMIT) * 100)) },
      dailyRequests: fallback.totalRequestsToday,
      dailyTokens: fallback.totalTokensToday,
      status: buildStatus(fallback.requestsThisMinute, fallback.tokensThisMinute, fallback.totalRequestsToday, fallback.totalTokensToday)
    }
  };
}

function resetFallbackWindowIfNeeded(now: number): void {
  if (now - fallback.lastResetTime > 60000) {
    fallback.requestsThisMinute = 0;
    fallback.tokensThisMinute = 0;
    fallback.lastResetTime = now;
  }
}

/**
 * Records ACTUAL usage after a provider call using one atomic-ish pipeline
 * (single round-trip; EXPIRE NX avoids immortal keys if a key was just created).
 */
export async function recordUsage(tokens: number): Promise<void> {
  const safeTokens = Number.isFinite(tokens) && tokens > 0 ? Math.ceil(tokens) : 0;
  const now = Date.now();
  const { rpmKey, tpmKey, dailyReqKey, dailyTokenKey } = limitKeys(now);

  if (isRedisConfigured()) {
    await callUpstashPipeline([
      ['INCR', rpmKey],
      ['EXPIRE', rpmKey, '120', 'NX'],
      ['INCRBY', tpmKey, String(safeTokens)],
      ['EXPIRE', tpmKey, '120', 'NX'],
      ['INCR', dailyReqKey],
      ['EXPIRE', dailyReqKey, '172800', 'NX'],
      ['INCRBY', dailyTokenKey, String(safeTokens)],
      ['EXPIRE', dailyTokenKey, '172800', 'NX']
    ]);
    return;
  }

  resetFallbackWindowIfNeeded(now);
  fallback.requestsThisMinute += 1;
  fallback.tokensThisMinute += safeTokens;
  fallback.totalRequestsToday += 1;
  fallback.totalTokensToday += safeTokens;
}

function coerceNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export async function getLimitStatus() {
  const now = Date.now();
  const { rpmKey, tpmKey, dailyReqKey, dailyTokenKey } = limitKeys(now);

  let rpm = 0;
  let tpm = 0;
  let dailyRequests = 0;
  let dailyTokens = 0;

  if (isRedisConfigured()) {
    const results = await callUpstashPipeline([
      ['GET', rpmKey],
      ['GET', tpmKey],
      ['GET', dailyReqKey],
      ['GET', dailyTokenKey]
    ]);
    if (results) {
      rpm = coerceNumber(results[0]);
      tpm = coerceNumber(results[1]);
      dailyRequests = coerceNumber(results[2]);
      dailyTokens = coerceNumber(results[3]);
    }
  } else {
    resetFallbackWindowIfNeeded(now);
    rpm = fallback.requestsThisMinute;
    tpm = fallback.tokensThisMinute;
    dailyRequests = fallback.totalRequestsToday;
    dailyTokens = fallback.totalTokensToday;
  }

  const rpmPercent = Math.min(100, Math.round((rpm / RPM_LIMIT) * 100));
  const tpmPercent = Math.min(100, Math.round((tpm / TPM_LIMIT) * 100));

  let status: 'healthy' | 'throttled' | 'critical' = 'healthy';
  if (rpm >= RPM_LIMIT || tpm >= TPM_LIMIT) {
    status = 'critical';
  } else if (rpmPercent > 85 || tpmPercent > 85) {
    status = 'critical';
  } else if (rpmPercent > 50 || tpmPercent > 50) {
    status = 'throttled';
  }

  return {
    rpm: { current: rpm, limit: RPM_LIMIT, percentage: rpmPercent },
    tpm: { current: tpm, limit: TPM_LIMIT, percentage: tpmPercent },
    dailyRequests,
    dailyTokens,
    status
  };
}
