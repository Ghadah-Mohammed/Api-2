const mongoose = require("mongoose")
const Joi = require("joi")
const { types } = require("joi")

const projectSchema = new mongoose.Schema({
  title: String,
  photo: [String],
  description: String,

  companyId: {
    type: mongoose.Types.ObjectId,
    ref: "Company",
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  comment: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
})

const projectAddJoi = Joi.object({
  title: Joi.string().min(2).max(50).required(),
  photo: Joi.array().items().min(1).max(1000),
  description: Joi.string().min(2).max(1000).required(),
})

const projectEditJoi = Joi.object({
  title: Joi.string().min(2).max(50),
  photo: Joi.array().items().min(1).max(1000),
  description: Joi.string().min(2).max(1000),
})

const Project = mongoose.model("Project", projectSchema)

module.exports.Project = Project
// module.exports.projectJoi=projectJoi
module.exports.projectAddJoi = projectAddJoi
module.exports.projectEditJoi = projectEditJoi
