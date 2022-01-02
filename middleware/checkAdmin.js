const jwt = require("jsonwebtoken")
const { Admin } = require("../models/Admin")

const checkAdmin = async (req, res, next) => {
  try {
    const adminToken = req.header("Authorization")
    if (!adminToken) return res.status(401).send("admin is missing")

    const decryptedAdmin = jwt.verify(adminToken, process.env.JWT_SECRET_KEY)
    const adminId = decryptedAdmin.id

    const admin = await Admin.findById(adminId)
    if (!admin) return res.status(404).send("admin not found")
    req.adminId = adminId
    next()
  } catch (error) {
    res.status(500).send(error.message)
  }
}
module.exports = checkAdmin
