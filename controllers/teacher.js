const Teacher = require("../model/Teacher");
const Student = require("../model/Student");

//teacher signup
exports.registerTeacher = async (req, res) => {
  try {
    const { name, subject, email, password } = req.body;

    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher is already exists",
      });
    }

    teacher = await Teacher.create({
      name,
      subject,
      email,
      password,
    });

    const token = await teacher.generateToken();

    res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      })
      .json({
        success: true,
        teacher,
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login teacher
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email }).select("+password");
    if (!teacher) {
      return res.status(400).json({
        success: false,
        message: "Email doesnot exists",
      });
    }

    const isMatched = await teacher.matchPassword(password);

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "useremail and password does not matched",
      });
    }

    const token = await teacher.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        success: true,
        message: 'Login Success',
        teacher,
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//logout user
exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "logout successfull",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//enroll student
exports.enrollNewStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const teacher = await Teacher.findById(req.teacher._id);

    if (!student) {
      return res.status(500).json({
        success: false,
        message: "student not found",
      });
    }

    student.teacher.push(req.teacher._id);
    teacher.students.push(req.params.id);

    await student.save();
    await teacher.save();

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//adding present attendence
exports.addPresentAttendence = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher._id);
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const attendence = {
      date: Date.now(),
      subject: teacher.subject,
      teacher: teacher.name,
      id: teacher._id,
    };

    student.present.push(attendence);

    await student.save();

    res.status(201).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//adding absent attendence
exports.addAbsentAttendence = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher._id);
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const attendence = {
      date: Date.now(),
      subject: teacher.subject,
      teacher: teacher.name,
      id: teacher._id,
    };

    student.absent.push(attendence);

    await student.save();

    res.status(201).json({
      success: true,
      student,
    });
  } catch (error) {
    res.send(500).json({
      success: false,
      message: error.message,
    });
  }
};

//my profile
exports.teacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id).populate("students");

    res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
