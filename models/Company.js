const mongoose = require("mongoose")
const Joi = require("joi")

const companysSchema = new mongoose.Schema({
  avatar: String,
  name: String,
  description: String,
  email: String,
  password: String,
  verified: Boolean,
  project: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
  ],
  engineer: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Engineer",
    },
  ],
  description: String,
  offer: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Offer",
    },
  ],
  comment: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
})

// const projectAddJoi = Joi.object({
//   title: Joi.string().min(4).max(20).required(),
//   description: Joi.string().min(4).required(),
//   photo: Joi.string().uri().min(5).max(1000).required(),
// })

// const projectEditJoi = Joi.object({
//   title: Joi.string().min(4).max(20).required(),
//   description: Joi.string().min(4).required(),
//   photo: Joi.string().uri().min(5).max(1000).required(),
// })

const signupJoi = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  avatar: Joi.string().uri().min(6).max(1000).required(),
  description: Joi.string().min(2).max(2000),
})

const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
})
const profilCompanyJoi = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  avatar: Joi.string().uri().min(6).max(1000).required(),
  description: Joi.string().min(6).max(1000),
  password: Joi.string().min(6).max(20),
})

const profilEditCompanyJoi = Joi.object({
  name: Joi.string().min(2).max(100),
  avatar: Joi.string().uri().min(6).max(1000),
  description: Joi.string().min(6).max(1000),
  password: Joi.string().min(6).max(20),
})

const Company = mongoose.model("Company", companysSchema)

module.exports.Company = Company
// module.exports.projectAddJoi = projectAddJoi
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
module.exports.profilCompanyJoi = profilCompanyJoi
module.exports.profilEditCompanyJoi = profilEditCompanyJoi
// module.exports.projectEditJoi = projectEditJoi
