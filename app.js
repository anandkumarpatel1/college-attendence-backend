const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json());
app.use("*",cors({
  origin: true,
  credentials: true,
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser())

//imported routes
const teacher = require('./routes/Teacher')
const student = require('./routes/Student')

//using route
app.use('/api/v1', teacher)
app.use('/api/v1', student)

module.exports = app;
