const Teacher = require("../model/Teacher");
const Student = require("../model/Student");

//creating student by teacher
exports.registerStudent = async (req, res) => {
  try {
    const { name, regNo, password, semRollNo, branch, semester } = req.body;

    let student = await Student.findOne({ regNo });
    if (student) {
      return res.status(400).json({
        success: false,
        message: "User is already exists",
      });
    }

    student = await Student.create({
      name,
      regNo,
      password,
      semRollNo,
      branch,
      semester,
    });

    const teacher = await Teacher.findById(req.teacher._id); //finding teacher bt login id

    teacher.students.push(student._id);

    await teacher.save(); //save teacher data

    student.teacher.push(req.teacher._id); //finding login teacher id and saving in the student array

    await student.save(); //save student data

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

//login student
exports.loginStudent = async (req, res) => {
  try {
    const { regNo, password } = req.body;
    const student = await Student.findOne({ regNo }).select("+password");
    if (!student) {
      return res.status(400).josn({
        success: false,
        message: "Reg No. is not valid",
      });
    }

    const isMatched = await student.matchPassowrd(password);

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Reg No and password is nt matched",
      });
    }

    const token = await student.generateToken();

    res.status(200).cookie("token", token, {
      expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      token,
      student
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
