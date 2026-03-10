const { redisClient } = require("../config/redis")

function rateLimiter(options){

    const { limit = 100, window = 60 } = options

    return async function(req,res,next){

        try{

            const ip = req.ip

            const key = `rate:${ip}`

            const requests = await redisClient.incr(key)

            // first request
            if(requests === 1){
                await redisClient.expire(key, window)
            }

            if(requests > limit){
                return res.status(429).json({
                    message: "Too many requests. Try again later."
                })
            }

            next()

        }catch(err){
            next(err)
        }

    }

}

module.exports = rateLimiter