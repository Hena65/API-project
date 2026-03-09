const {verifyToken}=require('../utils/token.util')
const {redisClient}=require('../config/redis')

const isAuthenticated=async(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization
        if(!authHeader){
            throw new Error("Authorization header missing")
        }
        const token=authHeader.split(" ")[1]
        if(!token){
            throw new Error("token missing")
        }
        const decoded=verifyToken(token,process.env.ACCESS_SECRET)
        const {userId,sessionId}=decoded;
        const storedToken=await redisClient.get(
            `refreshToken:${userId}:${sessionId}`
        )
        if(!storedToken){
            throw new Error("Session expired")
        }
        req.user={
            userId,
            sessionId
        }
        next()

    }catch(error){
        next(error)
    }
}


module.exports = { isAuthenticated };
