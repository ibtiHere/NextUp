// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Define the MiniTask schema
// const miniTaskSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: Number,
//     default: 0,
//   },
// });

// // Define the Task schema
// const taskSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   miniTasks: [miniTaskSchema],
//   completionStatus: {
//     type: Number,
//     default: 0,
//   },
// });

// // Define the Project schema
// const projectSchema = new Schema({
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   title: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: Number,
//     default: 0,
//   },
//   tasks: [taskSchema],
// });

// // Define the overall Projects structure
// const projectsSchema = new Schema({
//   allStatus: {
//     type: Number,
//     default: 0,
//   },
//   project: projectSchema,
//   // Add more projects here if needed
// });

// module.exports = projectsSchema;

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const TaskSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   desc: {
//     type: String,
//     required: false,
//   },
//   status: {
//     type: Boolean,
//     default: false,
//   },
// });

// const InnerProjectSchema = new Schema({
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   title: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: Number,
//     default: 0,
//   },
//   tasks: [TaskSchema],
// });

// const ProjectSchema = new Schema({
//   type: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: Number,
//     default: 0,
//   },
//   project: InnerProjectSchema,
// });

// module.exports = ProjectSchema;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  projectType: {
    type: Schema.Types.ObjectId,
    ref: "ProjectType",
    required: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

module.exports = mongoose.model("Project", ProjectSchema);
