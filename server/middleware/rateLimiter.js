import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 900000ms
    max:900, // 1 pr second over a 15 minute duration
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: 'draft-8', 
    legacyHeaders: false
})

export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 900000ms
    max: 100, // ~7 pr minute over a 15 minute duration
    message: {
        status: 429,
        error: 'Too many admin requests, please try again later.'
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 900000ms
    max: 10, // 10 pr 15 minutes
    message: {
        status: 429,
        error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false
});