interface LimitStats {
  requestsThisMinute: number;
  tokensThisMinute: number;
  totalRequestsToday: number;
  totalTokensToday: number;
  lastResetTime: number;
}

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

async function callUpstash(command: string[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.result;
    }
  } catch {
    // Fall back to memory
  }
  return null;
}

export async function recordUsage(tokens: number = 500): Promise<void> {
  const now = Date.now();
  const minuteBucket = Math.floor(now / 60000);
  const dayBucket = new Date(now).toISOString().slice(0, 10);

  const rpmKey = `ratelimit:rpm:${minuteBucket}`;
  const tpmKey = `ratelimit:tpm:${minuteBucket}`;
  const dailyReqKey = `ratelimit:daily:${dayBucket}`;
  const dailyTokenKey = `ratelimit:daily_tokens:${dayBucket}`;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    await Promise.all([
      callUpstash(['INCR', rpmKey]).then((_) => callUpstash(['EXPIRE', rpmKey, '60'])),
      callUpstash(['INCRBY', tpmKey, String(tokens)]).then((_) => callUpstash(['EXPIRE', tpmKey, '60'])),
      callUpstash(['INCR', dailyReqKey]).then((_) => callUpstash(['EXPIRE', dailyReqKey, '86400'])),
      callUpstash(['INCRBY', dailyTokenKey, String(tokens)]).then((_) => callUpstash(['EXPIRE', dailyTokenKey, '86400'])),
    ]);
    return;
  }

  // Fallback in-memory
  if (now - fallback.lastResetTime > 60000) {
    fallback.requestsThisMinute = 0;
    fallback.tokensThisMinute = 0;
    fallback.lastResetTime = now;
  }
  fallback.requestsThisMinute += 1;
  fallback.tokensThisMinute += tokens;
  fallback.totalRequestsToday += 1;
  fallback.totalTokensToday += tokens;
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
  const minuteBucket = Math.floor(now / 60000);
  const dayBucket = new Date(now).toISOString().slice(0, 10);

  const rpmKey = `ratelimit:rpm:${minuteBucket}`;
  const tpmKey = `ratelimit:tpm:${minuteBucket}`;
  const dailyReqKey = `ratelimit:daily:${dayBucket}`;
  const dailyTokenKey = `ratelimit:daily_tokens:${dayBucket}`;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  let rpm = 0;
  let tpm = 0;
  let dailyRequests = 0;
  let dailyTokens = 0;

  if (url && token) {
    const [rpmVal, tpmVal, dailyReqVal, dailyTokenVal] = await Promise.all([
      callUpstash(['GET', rpmKey]),
      callUpstash(['GET', tpmKey]),
      callUpstash(['GET', dailyReqKey]),
      callUpstash(['GET', dailyTokenKey])
    ]);
    rpm = coerceNumber(rpmVal);
    tpm = coerceNumber(tpmVal);
    dailyRequests = coerceNumber(dailyReqVal);
    dailyTokens = coerceNumber(dailyTokenVal);
  } else {
    if (now - fallback.lastResetTime > 60000) {
      fallback.requestsThisMinute = 0;
      fallback.tokensThisMinute = 0;
      fallback.lastResetTime = now;
    }
    rpm = fallback.requestsThisMinute;
    tpm = fallback.tokensThisMinute;
    dailyRequests = fallback.totalRequestsToday;
    dailyTokens = fallback.totalTokensToday;
  }

  const rpmLimit = 60;
  const tpmLimit = 100000;

  const rpmPercent = Math.min(100, Math.round((rpm / rpmLimit) * 100));
  const tpmPercent = Math.min(100, Math.round((tpm / tpmLimit) * 100));

  let status: 'healthy' | 'throttled' | 'critical' = 'healthy';
  if (rpmPercent > 85 || tpmPercent > 85) {
    status = 'critical';
  } else if (rpmPercent > 50 || tpmPercent > 50) {
    status = 'throttled';
  }

  return {
    rpm: { current: rpm, limit: rpmLimit, percentage: rpmPercent },
    tpm: { current: tpm, limit: tpmLimit, percentage: tpmPercent },
    dailyRequests,
    dailyTokens,
    status
  };
}