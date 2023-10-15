const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
  },

  subject: {
    type: String,
    required: [true, "Please Enter your subject"],
  },

  email: {
    type: String,
    required: [true, "Please Enter Email"],
  },

  password: {
    type: String,
    required: [true, "Please Entet password"],
    minlength: [8, "Password should be greater than 8 characters"],
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

teacherSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

teacherSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

teacherSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};
module.exports = mongoose.model("Teacher", teacherSchema);
