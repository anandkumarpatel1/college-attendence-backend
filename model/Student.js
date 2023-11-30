const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
  },

  image: {
    type: String,
    requierd: [true, "Please Enter your image"]
  },

  regNo: {
    type: String,
    required: [true, "Please Enter your Reg. No"],
  },

  password: {
    type: String,
    required: [true, "Please Enter your password"],
    minlength: [8, "Password is greater than 8 characters"],
  },

  semRollNo: {
    type: String,
    requierd: [true, "Please Enter your semester Roll No"],
  },

  branch: {
    type: String,
    required: [true, "Please Enter your branch"],
  },

  semester: {
    type: String,
    required: [true, "Please Enter your semester"],
  },

  teacher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],

  present: [
    {
      date: {
        type: Date,
        default: Date.now,
      },

      subject: {
        type: String,
      },

      teacher: {
        type: String,
      }
    }
  ],

  absent: [
    {
      date: {
        type: Date,
        default: Date.now,
      },

      subject: {
        type: String,
      },

      teacher: {
        type: String,
      }
    }
  ],
});

studentSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

studentSchema.methods.matchPassowrd = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("Student", studentSchema);
