const mongoose = require("mongoose")
const Joi = require("joi")

const EngineerSchema = new mongoose.Schema({
  name: String,
  photo: String,
})

const engineerJoi = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  photo: Joi.string().uri().min(5).max(1000),
})

const Engineer = mongoose.model("Engineer", EngineerSchema)
module.exports.Engineer = Engineer
module.exports.engineerJoi = engineerJoi
