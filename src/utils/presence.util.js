const {redisClient}=require('../config/redis')

const setUserOnline=async(userId,sessionId)=>{
    await redisClient.sAdd(
        `online:${userId}`,
        sessionId
    )
}

const setUserOffline=async(userId,sessionId)=>{
    await redisClient.sRem(
        `online:${userId}`,
        sessionId
    )
}

const isUserOnline=async(userId)=>{
    const count=await redisClient.sCard(
        `online:${userId}`
    )
    return count>0
}

module.exports={
    setUserOnline,
    setUserOffline,
    isUserOnline
}
