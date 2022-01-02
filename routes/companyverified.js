const { Company } = require("../models/Company")
const router = require("./companies")

//verfy company
router.get("/verfycompany", async (req, res) => {
  const companies = await Company.find({ verified: true }).populate("project").populate("engineer").populate("offer")
  res.json(companies)
})
