const jwt = require("jsonwebtoken")
const { Company } = require("../models/Company")

const checkCompany = async (req, res, next) => {
  try {
    const companyToken = req.header("Authorization")
    if (!companyToken) return res.status(401).send("company is missing")

    const decryptedCompany = jwt.verify(companyToken, process.env.JWT_SECRET_KEY)
    const companyId = decryptedCompany.id

    const company = await Company.findById(companyId)
    if (!company) return res.status(404).send("company not found")
    req.companyId = companyId
    next()
  } catch (error) {
    res.status(500).send(error.message)
  }
}
module.exports = checkCompany
