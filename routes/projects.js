const express = require("express")
const { route, path } = require("express/lib/application")
const req = require("express/lib/request")
const res = require("express/lib/response")
const checkCompany = require("../middleware/checkCompany")
const checkId = require("../middleware/checkId")
const checkUser = require("../middleware/checkUser")
const validateBody = require("../middleware/validateBody")
const validateId = require("../middleware/validateId")
const { Company } = require("../models/Company")
const { Project, projectAddJoi, projectEditJoi } = require("../models/Project")
// const { commentJoi, Comment } = require("../models/Comment")
const { User } = require("../models/User")
const checkAdmin = require("../middleware/checkAdmin")
const router = express.Router()

router.get("/", async (req, res) => {
  const projects = await Project.find()

    //-------------

    // .populate("engineers")
    // .populate({
    //   path: "comment",
    //   populate: {
    //     path: "owner",
    //     select: "-password -email -like",
    //   },
    // })
  res.json(projects)
})

router.get("/:id", checkId, async (req, res) => {
  const projects = await Project.findById(req.params.id)
    // .populate("engineers")
    .populate({
      path: "comment",
      populate: {
        path: "owner",
        select: "-password -email -like",
      },
    })
  res.json(projects)
})

// add project
router.post("/add-project", checkCompany, validateBody(projectAddJoi), async (req, res) => {
  const { title, photo, description } = req.body

  const project = new Project({
    title,
    photo,
    description,
    companyId: req.companyId,
  })
  await project.save()
  await Company.findByIdAndUpdate(req.companyId, { $push: { project: project._id } })

  res.json(project)
})

//edit project
router.put("/:id", checkCompany, checkId, validateBody(projectEditJoi), async (req, res) => {
  try {
    const { title, photo, description } = req.body

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, photo } },
      { new: true }
    )
    if (project.companyId != req.companyId) return res.status(403).send("unauthorized action")
    if (!project) return res.status(404).send("project not found")

    await project.save()
    res.json(project)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//delet project
router.delete("/:id", checkCompany, checkId, async (req, res) => {
  try {
    if (project.companyId != req.companyId) return res.status(403).send("unauthorized action")

    const project = await Project.findByIdAndRemove(req.params.id)
    if (!project) return res.status(404).send("project not found")
    res.send("project is remove")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//comment

/*get comment */
// router.get("/:projectId/comments", validateId("projectId"), async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.projectId)
//     if (!project) return res.status(404).send("project not found")

//     const comment = await Comment.find({ projectId: req.params.projectId })

//     res.json(comment)
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })

/*add comment */

// router.post("/:projectId/comments", checkUser, validateId("projectId"), validateBody(commentJoi), async (req, res) => {
//   try {
//     const { comment } = req.body
//     const project = await Project.findById(req.params.projectId)
//     if (!project) return res.status(404).send("project not found")

//     const newComment = new Comment({ comment, owner: req.userId, projectId: req.params.projectId })

//     await Project.findByIdAndUpdate(req.params.projectId, { $push: { comment: newComment } })
//     await newComment.save()

//     res.json(newComment)
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })

/*edit comment */

// router.put(
//   "/:projectId/comments/:commentId",
//   checkUser,
//   validateId("projectId", "commentId"),
//   validateBody(commentJoi),
//   async (req, res) => {
//     try {
//       const project = await Project.findById(req.params.projectId)
//       if (!project) return res.status(404).send("project not found")
//       const { comment } = req.body

//       const commentFound = await Comment.findById(req.params.commentId)
//       if (!commentFound) return res.status(400).send("comment not found")

//       const updatedcomment = await Comment.findByIdAndUpdate(req.params.commentId, { $set: { comment } }, { new: true })

//       res.json(updatedcomment)
//     } catch (error) {
//       res.status(500).send(error.message)
//     }
//   }
// )

/*delet comment */

// router.delete("/:projectId/comments/:commentId", checkUser, validateId("projectId", "commentId"), async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.projectId)
//     if (!project) return res.status(404).send("project not found")

//     const commentFound = await Comment.findById(req.params.commentId)
//     if (!commentFound) return res.status(400).send("comment not found")

//     const user = await User.findById(req.userId)
//     if (commentFound.owner != req.userId) return res.status(403).send("unauthorized action")

//     await Project.findByIdAndUpdate(req.params.projectId, { $pull: { comments: commentFound._id } })

//     await Comment.findByIdAndRemove(req.params.commentId)

//     res.send("comment is removed")
//   } catch (error) {
//     console.log(error)
//     res.status(500).send(error.message)
//   }
// })

/*Like */
router.get("/:projectId/likes", checkUser, validateId("projectId"), async (req, res) => {
  try {
    let project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).send("project not found")

    const userFound = project.likes.find(like => like == req.userId)
    if (userFound) {
      await Project.findByIdAndUpdate(req.params.projectId, { $pull: { likes: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $pull: { likes: req.params.projectId } })
      res.send("removed like from project")
    } else {
      await Project.findByIdAndUpdate(req.params.projectId, { $push: { likes: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $push: { likes: req.params.projectId } })
      res.send("project liked")
    }
  } catch (error) {
    res.status(500).send(error.massage)
  }
})

module.exports = router
