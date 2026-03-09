const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    managerProjectCount:{
        type:Number,
        default:0
    },
    memberTaskCount:{
        type:Number,
        default:0
    },
    isVerified:{
        type:Boolean,
        default:true
    },
    emailVerificationToken:{
        type:String
    }
},{
    timestamps:true
})

module.exports=mongoose.model("User",userSchema)