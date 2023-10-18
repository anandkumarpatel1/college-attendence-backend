const express = require("express");

const { registerStudent, loginStudent, getAllStudents } = require("../controllers/student");
const { isAuthenticated } = require("../middlerware/auth");

const router = express.Router();

router.route("/teacher/createstudent").post(isAuthenticated, registerStudent);
router.route('/student/login').post(loginStudent)
router.route('/students').get(getAllStudents)

module.exports = router;
