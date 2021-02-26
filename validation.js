// dependencies
const Joi = require("joi");

// form validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(256).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

module.exports = registerValidation;
