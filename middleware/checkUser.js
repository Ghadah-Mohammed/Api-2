const jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const checkUser = async (req, res, next) => {
  try {
    const userToken = req.header("Authorization")
    if (!userToken) return res.status(401).send("user is missing")

    const decryptedUser = jwt.verify(userToken, process.env.JWT_SECRET_KEY)
    const userId = decryptedUser.id

    const user = await User.findById(userId)
    if (!user) return res.status(404).send("user not found")
    req.userId = userId
    next()
  } catch (error) {
    res.status(500).send(error.message)
  }
}
module.exports = checkUser
