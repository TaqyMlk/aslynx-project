interface LimitStats {
  requestsThisMinute: number;
  tokensThisMinute: number;
  totalRequestsToday: number;
  totalTokensToday: number;
  lastResetTime: number;
}

declare global {
  var __aslynx_limits__: LimitStats | undefined;
}

if (!globalThis.__aslynx_limits__) {
  globalThis.__aslynx_limits__ = {
    requestsThisMinute: 0,
    tokensThisMinute: 0,
    totalRequestsToday: 0,
    totalTokensToday: 0,
    lastResetTime: Date.now()
  };
}

const stats = globalThis.__aslynx_limits__;

export function recordUsage(tokens: number = 500): void {
  const now = Date.now();
  if (now - stats.lastResetTime > 60000) {
    stats.requestsThisMinute = 0;
    stats.tokensThisMinute = 0;
    stats.lastResetTime = now;
  }

  stats.requestsThisMinute += 1;
  stats.tokensThisMinute += tokens;
  stats.totalRequestsToday += 1;
  stats.totalTokensToday += tokens;
}

export function getLimitStatus(): {
  rpm: { current: number; limit: number; percentage: number };
  tpm: { current: number; limit: number; percentage: number };
  dailyRequests: number;
  dailyTokens: number;
  status: 'healthy' | 'throttled' | 'critical';
} {
  const now = Date.now();
  if (now - stats.lastResetTime > 60000) {
    stats.requestsThisMinute = 0;
    stats.tokensThisMinute = 0;
    stats.lastResetTime = now;
  }

  const rpmLimit = 60;
  const tpmLimit = 100000;

  const rpmPercent = Math.min(100, Math.round((stats.requestsThisMinute / rpmLimit) * 100));
  const tpmPercent = Math.min(100, Math.round((stats.tokensThisMinute / tpmLimit) * 100));

  let status: 'healthy' | 'throttled' | 'critical' = 'healthy';
  if (rpmPercent > 85 || tpmPercent > 85) {
    status = 'critical';
  } else if (rpmPercent > 50 || tpmPercent > 50) {
    status = 'throttled';
  }

  return {
    rpm: { current: stats.requestsThisMinute, limit: rpmLimit, percentage: rpmPercent },
    tpm: { current: stats.tokensThisMinute, limit: tpmLimit, percentage: tpmPercent },
    dailyRequests: stats.totalRequestsToday,
    dailyTokens: stats.totalTokensToday,
    status
  };
}
