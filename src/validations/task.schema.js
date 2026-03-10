const Joi = require("joi");

const taskSchema = Joi.object().keys({
  title: Joi.string().required(),
  project: Joi.required(),
//   status: Joi.string().valid("todo", "inprogress", "done"),
  assignedTo: Joi.required(),
 
});

module.exports = taskSchema;
