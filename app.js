const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//imported routes
const teacher = require('./routes/Teacher')
const student = require('./routes/Student')

//using route
app.use('/api/v1', teacher)
app.use('/api/v1', student)

module.exports = app;
