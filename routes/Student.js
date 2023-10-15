const express = require("express");

const { registerStudent, loginStudent } = require("../controllers/student");
const { isAuthenticated } = require("../middlerware/auth");

const router = express.Router();

router.route("/teacher/createstudent").post(isAuthenticated, registerStudent);
router.route('/student/login').post(loginStudent)

module.exports = router;
