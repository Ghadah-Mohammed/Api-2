const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { signupJoi, Admin, loginJoi, profileJoi } = require("../models/Admin")
// const { Company } = require("../models/Company")
const validateBody = require("../middleware/validateBody")
const checkAdmin = require("../middleware/checkAdmin")
const checkCompany = require("../middleware/checkCompany")
const checkId = require("../middleware/checkId")
const req = require("express/lib/request")
const { Company } = require("../models/Company")
const { User } = require("../models/User")
const checkUser = require("../middleware/checkUser")
const { Project } = require("../models/Project")
const validateId = require("../middleware/validateId")
const { Comment } = require("../models/Comment")
const router = express.Router()

//signup Admin
router.post("/signup", validateBody(signupJoi), async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body

    const adminFound = await Admin.findOne({ email })
    if (adminFound) return res.status(400).send("admin already register")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const admin = new Admin({
      firstName,
      lastName,
      email,
      password: hash,
      avatar,
    })
    await admin.save()

    res.json(admin)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//login Admin
router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(400).send("admin not found")

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.send(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//verfy company
// router.get("/verfycompany", async (req, res) => {
//   const companies = await Company.find({ verified: true }).populate("project").populate("engineer").populate("offer")
//   res.json(companies)
// })
// get all company

router.get("/Companies", async (req, res) => {
  const companies = await Company.find()
    .populate("project")
    .populate("engineer")
    .populate({
      path: "project",
      select: "-__v",
      populate: {
        path: "comment",
      },
    })
    .populate({
      path: "project",
      select: "-__v",
      populate: {
        path: "likes",
      },
    })
  res.json(companies)
})


// get all users
router.get("/Users", async (req, res) => {
  const users = await User.find()
  res.json(users)
})


//delet user

/*delet comment */

router.delete("/:projectId/comments/:commentId", checkAdmin, validateId("projectId", "commentId"), async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).send("project not found")

    const commentFound = await Comment.findById(req.params.commentId)
    if (!commentFound) return res.status(400).send("comment not found")

    await Project.findByIdAndUpdate(req.params.projectId, { $pull: { comments: commentFound._id } })

    await Comment.findByIdAndRemove(req.params.commentId)

    res.send("comment is removed")
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})


// add admin
router.post("/add-admin", checkAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body

    const result = signupJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)

    // const userFound = await User.findOne({ email })
    // if (userFound) return res.status(400).send("user already registered")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const admin = new Admin({
      firstName,
      lastName,
      email,
      password:hash,
      avatar,
      // role: "Admin",
    })
    await admin.save()

    delete admin._doc.password
    res.json(admin)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
