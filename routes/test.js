router.post("/signup", validateBody(signupJoi), async (req, res) => {
    try {
      const { nameCompany, email, password, avatar } = req.body
  
      const companyFound = await Company.findOne({ email })
      if (companyFound) return res.status(400).send("company already register")
  
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const company = new Company({
        nameCompany,
        email,
        password: hash,
        avatar,
      })
      await company.save()
  
      res.json(company)
    } catch (error) {
      res.status(500).send(error.message)
    }
  })