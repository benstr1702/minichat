type RateLimitResult = {
	success: boolean;
	limit: number;
	remaining: number;
	reset: number;
};

type RateLimitIdentity = {
	requests: number[];
	reset: number;
};
// Simple in-memory rate limiting (use Redis in production)
const rateLimit = new Map<string, RateLimitIdentity>();

export async function checkRateLimit(
	identifier: string,
	limit = 100,
	window = 60000
): Promise<RateLimitResult> {
	const now = Date.now();
	const windowStart = now - window;

	const identity = rateLimit.get(identifier) || {
		requests: [],
		reset: now + window,
	};

	identity.requests = identity.requests.filter(
		(time: number) => time > windowStart
	);

	if (identity.requests.length >= limit) {
		return {
			success: false,
			limit,
			remaining: 0,
			reset: identity.reset,
		};
	}

	identity.requests.push(now);
	rateLimit.set(identifier, identity);

	return {
		success: true,
		limit,
		remaining: limit - identity.requests.length,
		reset: identity.reset,
	};
}
