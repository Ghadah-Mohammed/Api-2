const mongoose = require("mongoose")
const Joi = require("joi")

const AdminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: String,
})

const signupJoi = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  avatar: Joi.string().uri().min(6).max(1000).required(),
})

const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
})
// const profileJoi = Joi.object({
//   firstName: Joi.string().min(2).max(100),
//   lastName: Joi.string().min(2).max(100),
//   password: Joi.string().min(6).max(20),
//   avatar: Joi.string().uri().min(6).max(1000),
// })

const Admin = mongoose.model("Admin", AdminSchema)

module.exports.Admin = Admin
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
// module.exports.profileJoi = profileJoi
