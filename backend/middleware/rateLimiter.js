const { RateLimiterMemory } = require("rate-limiter-flexible");

const rateLimiter = new RateLimiterMemory({
  points: 20,
  duration: 60,
});

const userRateLimiter = new RateLimiterMemory({
  points: 1,
  duration: 1,
});

module.exports = { rateLimiter, userRateLimiter };
