const authService=require('../services/auth.service')

const register=async (req,res,next)=>{
    try{
        const user=await authService.registerUser(req.body)

        res.status(201).json({
            message:"User registered successfully",
            user
        })
    }catch(error){
        next(error)
    }
}

const login =async (req,res,next)=>{
    try{
        const {accessToken,refreshToken,user}=await authService.loginUser(req.body)

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false
        })

        res.status(201).json({
            message:"Login successful",
            accessToken,
            user
        })
    }catch(error){
        next(error)
    }
}

const refresh=async (req,res,next)=>{
    try{
        const token=req.cookies.refreshToken;
        const accessToken=await authService.refreshAccessToken(token)
        
        res.json({
            accessToken
        })
    }catch(error){
        next(error)
    }
}

const logout=async (req,res,next)=>{
    try{
        await authService.logoutUser(
            req.user.userId,
            req.user.sessionId
        )

        res.clearCookie("refreshToken")
        res.json({
            message:"logout successful"
        })
    }catch(error){
        next(error)
    }
}


module.exports={register,login,refresh,logout}

