const { redisClient } = require("../config/redis")


 const clearCache = async (pattern) => { 
    const keys = await redisClient.keys(pattern) 
    if (keys.length > 0) { 
        await redisClient.del(keys) } } 



module.exports = clearCache