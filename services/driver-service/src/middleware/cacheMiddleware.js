const cacheService = require("../services/cacheService");
const generateCacheKey = require("../utils/cacheKey");

const cacheMiddleware = (prefix) => {
    return async (req, res, next) => {
        try {
            const cacheKey = generateCacheKey(prefix, req.query);

            const cached = await cacheService.get(cacheKey);

            if (cached) {
                return res.json({
                    success: true,
                    source: "redis",
                    data: JSON.parse(cached),
                });
            }

            req.cacheKey = cacheKey;

            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = cacheMiddleware;