/* CREATED SCHEMAS FOR VALIDATION */

const Joi = require("joi");

/* VALIDATION FOR SIGNING USER */
exports.signUpSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

/* VALIDATION FOR SIGNING IN USER */
exports.signInSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

/* VALIDATION FOR CREATING NEW COMMUNITY */
exports.communitySchema = Joi.object({
  name: Joi.string().required().min(2),
});

/* VALIDATION FOR CREATING NEW MEMBER */
exports.memberSchema = Joi.object({
  community: Joi.string().required(),
  user: Joi.string().required(),
  role: Joi.string().required(),
});

/* VALIDATION FOR CREATING NEW ROLE */
exports.roleSchema = Joi.object({
    name: Joi.string().required().min(2),
  });
