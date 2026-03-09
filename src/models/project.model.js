const mongoose=require('mongoose')

const projectSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    managers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ],
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    isDeleted:{
        type:Boolean,
        default:false
    }
    
},{
    timestamps:true
})

module.exports=mongoose.model("Project",projectSchema);