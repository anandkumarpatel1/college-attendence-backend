const express = require("express");

const { registerStudent, loginStudent, getAllStudents, searchStudent, studentProfile } = require("../controllers/student");
const { isAuthenticated } = require("../middlerware/auth");

const router = express.Router();

router.route("/teacher/createstudent").get(isAuthenticated, registerStudent);
router.route('/student/login').post(loginStudent)
router.route('/students').get(isAuthenticated, getAllStudents)
router.route('/students/:key').get(isAuthenticated, searchStudent)
router.route('/student/:id').get(isAuthenticated, studentProfile)

module.exports = router;
