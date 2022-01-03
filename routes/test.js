 
//add comment
// router.post("/:companyId/comments", checkUser, validateId("companyId"), validateBody(commentJoi), async (req, res) => {
//   try {
//     const { comment } = req.body
//     const company = await Company.findById(req.params.companyId)
//     if (!company) return res.status(404).send("company not found")

//     const newComment = new Comment({ comment, owner: req.userId, companyId: req.params.companyId })

//     await Company.findByIdAndUpdate(req.params.companyId, { $push: { comment: newComment } })
//     await newComment.save()

//     res.json(newComment)
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })





// router.delete("/:companyId/comments/:commentId", checkUser, validateId("companyId", "commentId"), async (req, res) => {
//   try {
//     const company = await Company.findById(req.params.companyId)
//     if (!company) return res.status(404).send("company not found")

//     const commentFound = await Comment.findById(req.params.commentId)
//     if (!commentFound) return res.status(400).send("comment not found")

//     const user = await User.findById(req.userId)
//     if (commentFound.owner != req.userId) return res.status(403).send("unauthorized action")

//     await Company.findByIdAndUpdate(req.params.companyId, { $pull: { comments: commentFound._id } })

//     await Comment.findByIdAndRemove(req.params.commentId)

//     res.send("comment is removed")
//   } catch (error) {
//     console.log(error)
//     res.status(500).send(error.message)
//   }
// })