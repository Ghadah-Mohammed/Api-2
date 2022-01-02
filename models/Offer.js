const mongoose = require("mongoose")
const Joi = require("joi")

const offerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  companyId: {
    type: mongoose.Types.ObjectId,
    ref: "Company",
  },
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["progress", "pending", "refused", "finished"],
  },
})

const offerJoi = Joi.object({
  title: Joi.string().min(2).max(1000).required(),
  description: Joi.string().min(2).max(1000).required(),
})

const Offer = mongoose.model("Offer", offerSchema)

module.exports.Offer = Offer
module.exports.offerJoi = offerJoi
