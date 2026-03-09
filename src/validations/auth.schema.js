const Joi=require('joi')

const authSchema=Joi.object().keys({
    name:Joi.string().required(),
    email:Joi.unique().required(),
    password:Joi.required()
})

module.exports=authSchema;