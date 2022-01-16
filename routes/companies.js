const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { signupJoi, Company, loginJoi, profilCompanyJoi, profilEditCompanyJoi } = require("../models/Company")
const validateBody = require("../middleware/validateBody")
const checkCompany = require("../middleware/checkCompany")
const checkUser = require("../middleware/checkUser")
const { offerJoi, Offer } = require("../models/Offer")
const { Project, projectAddJoi } = require("../models/Project")
const { Engineer, engineerJoi } = require("../models/Engineer")
const checkId = require("../middleware/checkId")
const checkAdmin = require("../middleware/checkAdmin")
const validateId = require("../middleware/validateId")
const { commentJoi, Comment } = require("../models/Comment")

const req = require("express/lib/request")
const { User } = require("../models/User")

router.get("/profile", checkCompany, async (req, res) => {
  const companies = await Company.findById(req.companyId)
    .populate("project")
    .populate({
      path: "offer",
      populate: {
        path: "userId",
        select: "-password  -like",
      },
    })
    .populate({
      path: "comment",
      populate: {
        path: "owner",
        select: "-password -email -like",
      },
    })
    .populate("engineer")
  res.json(companies)
})

//show company verfy
// router.get("/",async(req,res)=>{
//   const verfycompany=await Company.find({})
// })

//get engineer
router.get("/engineers", async (req, res) => {
  const engineers = await Engineer.find()
  res.json(engineers)
})

//addengineer
router.post("/add-engineer", checkCompany, validateBody(engineerJoi), async (req, res) => {
  const { name, photo } = req.body

  const engineer = new Engineer({
    name,
    photo,
  })
  await engineer.save()
  await Company.findByIdAndUpdate(req.companyId, { $push: { engineer: engineer._id } })

  res.json(engineer)
})

//delete engineering
router.delete("/engineerdelet/:id", checkCompany, checkId, async (req, res) => {
  try {
    await Company.findByIdAndUpdate(req.companyId, { $pull: { engineer: req.params.id } })

    const engineer = await Engineer.findById(req.params.id)
    if (!engineer) return res.status(404).send("engineer is not found")

    engineer.remove()
    res.json("engineer removed")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//signup Company
router.post("/signup", validateBody(signupJoi), async (req, res) => {
  try {
    const { name, description, email, password, avatar } = req.body

    const companyFound = await Company.findOne({ email })
    if (companyFound) return res.status(400).send("company already register")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const company = new Company({
      name,
      description,
      email,
      password: hash,
      avatar,
      verified: false,
    })
    await company.save()

    res.json(company)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/:companyId/verify", checkAdmin, validateId("companyId"), async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.companyId, { $set: { verified: true } }, { new: true })
    if (!company) return res.status(400).send("company not found")
    res.json(company)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
//login Company
router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body
    const company = await Company.findOne({ email })
    if (!company) return res.status(400).send("company not found")

    const valid = await bcrypt.compare(password, company.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.send(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// router.get("/", async (req, res) => {
//   const companies = await Company.find()
//   res.json(companies)
// })

// router.get(":/allproject", async (req, res) => {
//   const project = await Project.find()
//   res.json(project)
// })

//getproject//.................//.......................//.......................//

// router.get("/projects", checkCompany, async (req, res) => {
//   const projects = await Project.find().populate("companyId")
//   res.json(projects)
// })

//get one project//...................//...................//....................//

// router.get("/projects/:id", async (req, res) => {
//   const projects = await Project.findById(req.params.id).populate("companyId")
//   res.json(projects)
// })

//get one company

router.get("/company/:id", async (req, res) => {
  const company = await Company.findById(req.params.id).populate({
    path: "comment",
    populate: {
      path: "owner",
      select: "-password -email -like",
    },
  })
  res.json(company)
})

//get profile
// router.get("/getprofile", checkCompany, async (req, res) => {
//   const company = await Company.findById(req.companyId)
//   res.json(company)
// })

//get engineer
router.get("/engineer", checkCompany, async (req, res) => {
  const engineers = await Engineer.find().populate("engineer")
  res.json(engineers)
})

// // router.post(":/profile", checkCompany, async (req, res) => {
//   const { name, avatar, description, projects } = req.body
//   try {
//     const result = profilCompanyJoi.validate(req.body)
//     if (!result.error) return res.status(400).send(result.error.details[0].message)

//     const company = new Company({
//       name,
//       avatar,
//       description,
//       projects,
//     })

//     await company.save()
//     res.json(company)
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })

router.put("/profile", checkCompany, validateBody(profilEditCompanyJoi), async (req, res) => {
  try {
    const { name, avatar, description, password } = req.body
    const salt = await bcrypt.genSalt(10)
    let hash
    if (password) hash = await bcrypt.hash(password, salt)
    const company = await Company.findByIdAndUpdate(
      req.companyId,
      { $set: { name, avatar, description, password: hash } },
      { new: true }
    )
    if (!company) return res.status(400).send("company not found")
    res.json(company)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//delet company
router.delete("/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const company = await Company.findByIdAndRemove(req.params.id)
    if (!company) return res.status(404).send("company not found")

    await Project.deleteMany({ companyId: req.params.id })
    await Offer.deleteMany({ companyId: req.params.id })
    res.send("company is remove")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//delete Offer
router.delete("/offer/:id", checkId, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndRemove(req.params.id)
    if (!offer) return res.status(404).send("offer is not found")

    await Project.deleteMany({ offerId: req.params.id })
    res.send("offer is remove")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//send offer user
router.post("/:companyId/:projectId/sendoffer", checkUser, validateBody(offerJoi), async (req, res) => {
  const { title, description } = req.body
  const offer = new Offer({
    title,
    description,
    userId: req.userId,
    projectId: req.params.projectId,
    companyId: req.params.companyId,
    status: "pending",
  })
  await offer.save()
  const user = await User.findById(req.userId).populate("offers")
  const userFound = user.offers.find(user => user.projectId == req.params.projectId)
  console.log(userFound)
  if (userFound) return res.status(403).send("user already sent offer for this project")

  await Company.findByIdAndUpdate(req.params.companyId, { $push: { offer: offer._id } })
  await User.findByIdAndUpdate(req.userId, { $push: { offers: offer._id } })

  res.json(offer)
})

//answer company
router.post("/:offerId/answeroffer", checkCompany, async (req, res) => {
  const { status } = req.body
  const offer = await Offer.findByIdAndUpdate(
    req.params.offerId,
    {
      status,
    },
    { new: true }
  )

  res.json(offer)
})
//verfy company
router.get("/:id/verify", async (req, res) => {
  const companies = await Company.findByIdAndUpdate(req.params.id, { $set: { verified: true } })
  res.json(companies)
})

//verifiedCompanies
router.get("/verifiedCompanies", async (req, res) => {
  const companies = await Company.find({ verified: true })
    .populate({
      path: "comment",
      populate: {
        path: "owner",
        select: "-password -email -like",
      },
    })
    .populate("project")
    .populate("engineer")
  // .populate({
  //   path: "project",
  //   select: "-__v",
  //   populate: {
  //     path: "likes",
  //   },
  // })
  res.json(companies)
})

//add comment
router.post("/:companyId/comments", checkUser, validateId("companyId"), validateBody(commentJoi), async (req, res) => {
  try {
    const { comment } = req.body
    const company = await Company.findById(req.params.companyId)
    if (!company) return res.status(404).send("company not found")

    const newComment = new Comment({ comment, owner: req.userId, companyId: req.params.companyId })

    await Company.findByIdAndUpdate(req.params.companyId, { $push: { comment: newComment } })
    await newComment.save()

    res.json(newComment)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//edit comment
router.put(
  "/:companyId/comments/:commentId",
  checkUser,
  validateId("companyId", "commentId"),
  validateBody(commentJoi),
  async (req, res) => {
    try {
      const company = await Company.findById(req.params.companyId)
      if (!company) return res.status(404).send("company not found")
      const { comment } = req.body

      const commentFound = await Comment.findById(req.params.commentId)
      if (!commentFound) return res.status(400).send("comment not found")

      const updatedcomment = await Comment.findByIdAndUpdate(req.params.commentId, { $set: { comment } }, { new: true })

      res.json(updatedcomment)
    } catch (error) {
      res.status(500).send(error.message)
    }
  }
)

//delet comment
router.delete("/:companyId/comments/:commentId", checkUser, validateId("companyId", "commentId"), async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId)
    if (!company) return res.status(404).send("company not found")

    const commentFound = await Comment.findById(req.params.commentId)
    if (!commentFound) return res.status(400).send("comment not found")

    const user = await User.findById(req.userId)
    if (commentFound.owner != req.userId) return res.status(403).send("unauthorized action")

    await Company.findByIdAndUpdate(req.params.companyId, { $pull: { comments: commentFound._id } })

    await Comment.findByIdAndRemove(req.params.commentId)

    res.send("comment is removed")
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

module.exports = router
