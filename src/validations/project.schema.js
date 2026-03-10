const Joi=require('joi')

const projectSchema=Joi.object().keys({
    name:Joi.string().required(),
    owner:Joi.required()
    // managers:Joi.required()
})

module.exports=projectSchema;
