const mongoose = require("mongoose")

const validateId = (...idArray) => {
  return async (req, res, next) => {
    try {
      idArray.forEach(idName => {
        const id = req.params[idName]
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send(`the path${idName}is not valid object id`)
      })
      next()
    } catch (error) {
      res.status(500).send(error.message)
    }
  }
}

module.exports=validateId
