const express = require("express");
const { registerTeacher, loginTeacher, logout, enrollNewStudent, studentAttendence, teacherProfile } = require("../controllers/teacher");
const { isAuthenticated } = require("../middlerware/auth");

const router = express.Router();

//creating route
router.route("/teacher/register").post(registerTeacher);
router.route("/teacher/login").post(loginTeacher)
router.route("/logout").get(isAuthenticated, logout)
router.route("/student/enroll/:id").post(isAuthenticated, enrollNewStudent)
router.route("/attendence/student/:id").post(isAuthenticated, studentAttendence)
router.route("/teacher").get(isAuthenticated, teacherProfile)

module.exports = router;
