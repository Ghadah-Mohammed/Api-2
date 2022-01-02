const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const joi = require("joi")
const JoiobjectId = require("joi-objectid")
joi.objectid = JoiobjectId(joi)
const users = require("./routes/users")
const admin = require("./routes/admin")
const projects = require("./routes/projects")
const companies = require("./routes/companies")
require("dotenv").config()
mongoose
  .connect(`mongodb://localhost:27017/engineering`)
  .then(() => {
    console.log("Connected to MangoDB")
  })
  .catch(error => {
    console.log("error connecting to MangoDB", error)
  })

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/auth", users)
app.use("/api/company", companies)
app.use("/api/admin", admin)
app.use("/api/project", projects)
app.listen(5000, () => {
  console.log("server is listenin on port :" + 5000)
})
