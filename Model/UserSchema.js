// const mongoose = require("mongoose");
// const projectsSchema = require("../Model/ProjectSchema");
// const UserSchema = mongoose.Schema({
//   fullname: {
//     type: String,
//     required: [true, "Fullname is required"],
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: [true, "Email is required"],
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//     minLength: [8, "password must be at least 8 characters"],
//   },
//   profileImage: {
//     type: String,
//     required: false,
//     default: "", // Initially empty
//   },
//   projects: {
//     completionStatus: {
//       type: Number,
//       default: 0,
//     },
//     projectsList: [projectsSchema],
//   },
// });

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Fullname is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "password must be at least 8 characters"],
  },
  profileImage: {
    type: String,
    required: false,
    default: "", // Initially empty
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
// module.exports = mongoose.model("User", UserSchema);
