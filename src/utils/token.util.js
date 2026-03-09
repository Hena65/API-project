const jwt = require('jsonwebtoken')

const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.ACCESS_SECRET,
        { expiresIn: "60m" }
    )
}

const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    )
}

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken
}