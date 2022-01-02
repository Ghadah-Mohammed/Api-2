const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { signupJoi, User, loginJoi, profileJoi } = require("../models/User")
const validateBody = require("../middleware/validateBody")
const checkUser = require("../middleware/checkUser")
const req = require("express/lib/request")
const checkAdmin = require("../middleware/checkAdmin")
const checkId = require("../middleware/checkId")
const router = express.Router()

//signup User
router.post("/signup", validateBody(signupJoi), async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).send("user already register")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      avatar,
    })
    await user.save()

    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//login User
router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).send("user not found")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.send(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/getprofile", checkUser, async (req, res) => {
  const user = await User.findById(req.userId)
  res.json(user)
})

router.put("/profile", checkUser, validateBody(profileJoi), async (req, res) => {
  const { firstName, lastName, password, avatar } = req.body

  let hash
  if (password) {
    const salat = await bcrypt.genSalt(10)
    hash = await bcrypt.hash(password, salat)
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { firstName, lastName, password: hash, avatar } },
    { new: true }
  ).select("-__v-password")
  res.json(user)
})

router.delete("/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const users = await User.findByIdAndRemove(req.params.id)
    console.log(users)
    if (!users) return res.status(404).send("user not found")
    res.send("user is remove")
  } catch (error) {
    res.status(500).send(error.message)
  }
})
module.exports = router
