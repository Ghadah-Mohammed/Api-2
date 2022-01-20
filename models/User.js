const mongoose = require("mongoose")
const Joi = require("joi")

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: "https://icon-library.com/images/profile-image-icon/profile-image-icon-0.jpg",
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
  ],
  offers: [{ type: mongoose.Types.ObjectId, ref: "Offer" }],
})

const signupJoi = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  avatar: Joi.string().uri().min(6).max(1000),
})

const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
})
const profileJoi = Joi.object({
  firstName: Joi.string().min(2).max(100),
  lastName: Joi.string().min(2).max(100),
  password: Joi.string().min(6).max(20).allow(""),
  avatar: Joi.string().uri().min(6).max(1000),
})

const User = mongoose.model("User", UserSchema)

module.exports.User = User
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
module.exports.profileJoi = profileJoi
