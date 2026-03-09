
const { redisClient } = require("../config/redis")

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    try {
      const key = `${req.originalUrl}`

      const cachedData = await redisClient.get(key)

      if (cachedData) {
        return res.json(JSON.parse(cachedData))
      }

      const originalJson = res.json.bind(res)

      res.json = async (data) => {
        await redisClient.setEx(key, duration, JSON.stringify(data))
        return originalJson(data)
      }

      next()

    } catch (error) {
      next()
    }
  }
}

module.exports = cacheMiddleware

