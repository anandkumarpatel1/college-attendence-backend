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

//logout user
exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()) })
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

    if (!student) {
      return res.status(500).json({
        success: false,
        message: "student not found",
      });
    }

    student.teacher.push(req.teacher._id);

    await student.save();

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

//adding attendence
exports.studentAttendence = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher._id);
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const { data } = req.body;

    if (data) {
      const attendence = {
        date: Date.now(),
        subject: teacher.subject,
        teacher: teacher.name,
      };

      student.present.push(attendence);
    }

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
    const user = await Teacher.findById(req.teacher.id)

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}