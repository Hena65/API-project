const crypto=require('crypto')
const User=require('../models/user.model')
const {hashPassword,comparePassword}=require('../utils/hash.util')
const {generateAccessToken,generateRefreshToken,verifyToken}=require('../utils/token.util')
const {setUserOnline,setUserOffline}=require('../utils/presence.util')
const {redisClient}=require('../config/redis')

const registerUser=async(data)=>{
    const {email,password,name}=data;
    const existingUser=await User.findOne({email})
    if(existingUser){
        throw new Error("user already existing")
    }
    const hashedPassword=await hashPassword(password)
    const user=User.create({
        name,
        email,
        password:hashedPassword
    })
    return user
}

const loginUser=async(data)=>{
    const {email,password}=data;
    const user=await User.findOne({email})
    if(!user){
        throw new Error("Invalid credentials")
    }
    const isMatch=await comparePassword(password,user.password)
    if(!isMatch){
         throw new Error("Invalid credentials")
    }

    const sessionId=crypto.randomUUID()

    const accessToken=generateAccessToken({
        userId:user._id,
        sessionId
    })

    const refreshToken=generateRefreshToken({
        userId:user._id,
        sessionId
    })

    await redisClient.set(
        `refreshToken:${user._id}:${sessionId}`,
        refreshToken,
        {EX:7*24*60*60}
    )

    await setUserOnline(user._id,sessionId)

    return {
        accessToken,
        refreshToken,
        sessionId,
        user
    }

}

const refreshAccessToken=async(token)=>{
    if(!token){
        throw new Error("missing refresh token")
    }
    const decoded=verifyToken(token,process.env.REFRESH_SECRET)
    const storedToken=await redisClient.get(
        `refreshToken:${decoded.userId}:${decoded.sessionId}`
    )
    if(!storedToken || storedToken!==token){
        throw new Error("Invalid refresh token")
    }
    const newAccessToken=generateAccessToken({
        userId:decoded.userId,
        sessionId:decoded.sessionId
    })
    return newAccessToken
}

const logoutUser=async(userId,sessionId)=>{
    await redisClient.del(`refreshToken:${userId}:${sessionId}`)
    await setUserOffline(userId,sessionId)
}

module.exports={
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
}



