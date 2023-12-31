const express = require("express");
const { registerTeacher, loginTeacher, logout, enrollNewStudent, addPresentAttendence, teacherProfile, addAbsentAttendence } = require("../controllers/teacher");
const { isAuthenticated } = require("../middlerware/auth");

const router = express.Router();

//creating route
router.route("/teacher/register").post(registerTeacher);
router.route("/teacher/login").post(loginTeacher)
router.route("/logout").get(isAuthenticated, logout)
router.route("/student/enroll/:id").get(isAuthenticated, enrollNewStudent)
router.route("/attendence/present/student/:id").get(isAuthenticated, addPresentAttendence)
router.route("/attendence/absent/student/:id").get(isAuthenticated, addAbsentAttendence)
router.route("/teacher").get(isAuthenticated, teacherProfile)

module.exports = router;
