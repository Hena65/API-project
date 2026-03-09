const jwt=require('jsonwebtoken')

const generateAccessToken=(user)=>{
    return jwt.sign(
        {id:user._id},
        process.env.ACCESS_SECRET,
        {expiresIn:"60m"}
    )
}

const generateRefreshToken=(user)=>{
    return jwt.sign(
        {id:user._id},
        process.env.REFRESH_SECRET,
        {expiresIn:"7d"}
    )
}

const verifyToken=(token,secret)=>{
    return jwt.verify(token,secret)
}

module.exports={generateAccessToken,generateRefreshToken,verifyToken}