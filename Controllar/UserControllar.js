const randomstring = require("randomstring");
const User = require("../Model/UserSchema");
const OTPSchema = require("../Model/OTPSchema");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ProjectType = require("../Model/projectTypeSchema");
const Project = require("../Model/ProjectSchema");
const Task = require("../Model/TaskSchema");
// generate OTP
const GenerateOTP = () => {
  const newOtp = randomstring.generate({
    length: 4,
    charset: "numeric",
  });
  return newOtp;
};

const checkEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
};

// Function to send OTP via email
const sendOTPByEmail = async (email, otp) => {
  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "engineerwaqas189@gmail.com",
      pass: "pphx jjse btlh kbqv",
    },
  });

  // Verify the transporter
  transporter.verify((error, success) => {
    if (error) {
      console.error("Error verifying transporter:", error);
    } else {
      console.log("Transporter is ready to send emails");
    }
  });
  // Setup email data
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // list of receivers
    subject: "OTP for Verification", // Subject line
    text: `Your OTP for forget password is ${otp}`, // plain text body
    // html: '<b>Hello world?</b>' // html body
  };

  // Send email with defined transport object
  let info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
};

// req account
exports.requestAccount = async (req, res) => {
  const { email } = req.body;
  checkEmailFormat(email);

  try {
    console.log("requestAccount route hits");
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const otpExists = await OTPSchema.findOne({ identity: email });
    console.log("exists otp ======>", otpExists);
    if (otpExists) {
      await OTPSchema.findByIdAndDelete(otpExists._id);
    }
    const otp = GenerateOTP();
    const newOTP = new OTPSchema({
      identity: email,
      otp: otp,
    });
    console.log("newOTP====>", newOTP);
    await newOTP.save();
    // Send OTP via email
    await sendOTPByEmail(email, otp);
    return res.status(200).json({
      status: "success",
      message: "OTP has been sent to this phone successfully",
      otp: newOTP.otp,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// Route to verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }
  try {
    checkEmailFormat(email);
    // Check if an OTP exists for the given email
    const otpEntry = await OTPSchema.findOne({ identity: email });
    if (!otpEntry) {
      return res.status(400).json({ message: "OTP not found for this email" });
    }

    // Check if the OTP is valid
    if (otpEntry.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // OTP is valid and user does not exist, proceed with your logic
    return res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
      email: email,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//signUp
exports.signUp = async (req, res) => {
  try {
    const { fullname, email, password, confrimPassword } = req.body;
    const isUser = await User.findOne({ email });
    console.log("user ========>", isUser);
    if (isUser) {
      return res.status(404).json({
        status: "failed",
        message: `User already registered with this email:${email}`,
      });
    }
    if (password !== confrimPassword) {
      return res.status(400).json({
        status: "failed",
        message: "password not match",
      });
    }
    const hashPassword = await bcrypt.hash(password, 8);
    console.log("hashPassword: ", hashPassword);
    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
      profileImage: "",
      projects: {
        allStatus: 0,
        projectsList: [],
      },
    });

    // Save the user to the database
    await newUser.save();
    return res.status(200).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log("error====>", err);
    return res.status(500).json({
      status: "failed",
      message: err,
    });
  }
};

// //login user
exports.login = async (req, res) => {
  try {
    // console.log("login route hit", req);
    const { email, password } = req.body;
    checkEmailFormat(email);
    const user = await User.findOne({ email: email });
    console.log("user ========>", user);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log("error=====>", err);
        return res.status(500).json({
          status: "failed",
          message: err.message,
        });
      }
      if (result) {
        // console.log("result ====>", result);
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.SCRATEKEY,
          {
            expiresIn: "24h",
          }
        );
        return res.status(200).json({
          status: "success",
          message: "login successfully",
          data: {
            user: user,
            token: token,
          },
        });
      } else {
        return res.status(404).json({
          status: "failed",
          message: "passwords do not match",
        });
      }
    });
  } catch (err) {
    console.log("error waqas =====>", err);
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

//forgetPassword
exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    checkEmailFormat(email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: "failed",
        message: "User does not exist",
      });
    }
    // check opt exists and remove first
    const isOtpExists = await OTPSchema.findOne({ identity: email });
    console.log("otp exists ======>", isOtpExists);
    if (isOtpExists) {
      await OTPSchema.findByIdAndDelete(isOtpExists._id);
    }

    //generate new otp
    const otp = GenerateOTP();
    const newOTP = new OTPSchema({
      identity: email,
      otp: otp,
    });
    console.log("newotp====>", newOTP);
    await newOTP.save();
    await sendOTPByEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Just send you OTP, plz verify and set your new password",
      otp: newOTP.otp,
    });
  } catch (err) {
    console.log("error====>", err);
    res.status(500).json({ message: err.message });
  }
};

//verfiy otp for forget password
exports.verfiyOTPForgetPass = async (req, res) => {
  try {
    console.log("verify forgetpass route");
    const { email, otp } = req.body;
    checkEmailFormat(email);
    const otpExists = await OTPSchema.findOne({ identity: email });
    const isUser = await User.findOne({ email: email });
    console.log("otp exist ==>", otpExists);
    if (!isUser) {
      return res.status(400).json({
        status: "failed",
        message: "User Not found",
      });
    }
    if (isUser.email !== otpExists.identity) {
      return res.status(400).json({
        status: "failed",
        message: `requested email is not same`,
      });
    }

    if (otpExists.otp !== otp) {
      return res.status(400).json({
        status: "failed",
        message: `invalid otp`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Otp Verified successfully",
    });
  } catch (err) {
    console.log("error====>", err);
    return res.status(500).json({ message: err.message });
  }
};

//set new password
exports.setNewPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    checkEmailFormat(email);
    const otpExists = await OTPSchema.findOne({ identity: email });
    console.log("otp exist ==>", otpExists);
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "User Not found",
      });
    }
    if (user.email !== otpExists.identity) {
      return res.status(400).json({
        status: "failed",
        message: `requested email is not same`,
      });
    }
    if (otpExists.otp !== otp) {
      return res.status(400).json({
        status: "failed",
        message: `invalid otp`,
      });
    }

    if (newPassword.length >= 8) {
      const hashPassword = await bcrypt.hash(newPassword, 8);
      console.log("hashPassword: ", hashPassword);
      user.password = hashPassword;
      await user.save();
      return res.status(200).json({
        status: "success",
        message: "new password has been set successfully",
        data: {
          user,
        },
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: "password must be at least 8 characters",
      });
    }
  } catch (err) {
    console.log("error====>", err);
    return res.status(500).json({ message: err.message });
  }
};

// // Add New Project
// exports.addNewProject = async (req, res) => {
//   const { userId, title, type } = req.body;
//   console.log("userid ==>", userId);

//   if (!userId || !title || !type) {
//     return res.status(400).json({
//       status: "failed",
//       message: "User ID, title, and type are required",
//     });
//   }

//   // Convert userId to ObjectId if valid
//   let objectId;
//   try {
//     objectId = new mongoose.Types.ObjectId(userId);
//   } catch (err) {
//     return res.status(400).json({ message: err.message });
//   }

//   try {
//     const user = await User.findById(objectId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if a project with the same title already exists
//     const existingProject = user.projects.projectsList.find(
//       (project) => project.project.title === title
//     );
//     if (existingProject) {
//       return res.status(400).json({
//         status: "failed",
//         message: "A project with this title already exists",
//       });
//     }
//     const newProject = {
//       type,
//       status: 0,
//       project: {
//         date: new Date(),
//         title,
//         status: 0,
//         tasks: [],
//       },
//     };
//     user.projects.projectsList.push(newProject);
//     await user.save();
//     console.log("user=====================================>", user);

//     return res.status(201).json({
//       message: "Project added successfully",
//       data: {
//         user,
//       },
//     });
//   } catch (err) {
//     console.log("error====>", err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };

//add new project
// exports.addNewProject = async (req, res) => {
//   const { userId, title, type } = req.body;
//   console.log("userid ==>", userId);
//   if (!userId || !title || !type) {
//     return res.status(400).json({
//       status: "failed",
//       message: "User ID, title, and type are required",
//     });
//   }

//   // Convert userId to ObjectId if valid
//   let objectId;
//   try {
//     objectId = new mongoose.Types.ObjectId(userId);
//   } catch (err) {
//     return res.status(400).json({ message: err.message });
//   }

//   try {
//     const user = await User.findById(objectId).populate("");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if a project with the same title already exists
//     const existingProject = user.projects.projectsList.find(
//       (project) => project.project.title === title
//     );
//     if (existingProject) {
//       return res.status(400).json({
//         status: "failed",
//         message: "A project with this title already exists",
//       });
//     }

//     // Create a new project
//     const newProject = {
//       allStatus: 0,
//       project: {
//         title,
//         type,
//         date: new Date(),
//         status: 0,
//         tasks: [],
//       },
//     };

//     user.projects.projectsList.push(newProject);
//     await user.save();
//     console.log("user=====================================>", user);
//     return res.status(201).json({
//       message: "Project added successfully",
//       data: {
//         user,
//       },
//     });
//   } catch (err) {
//     console.log("error====>", err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };

////////////////////////////////////////////////////////////////

// Create a new project type
exports.createProjectType = async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "unauthorized user",
    });
  }

  try {
    const existingProjectType = await ProjectType.findOne({
      title,
      user: userId,
    });
    if (existingProjectType) {
      return res.status(400).json({
        status: "failed",
        message: `A project type with title '${title}' already exists for this user`,
      });
    }
    // Create a new project type
    const newProjectType = new ProjectType({
      title,
      user: userId,
    });
    await newProjectType.save();
    return res.status(201).json({
      status: "success",
      message: "Project type created successfully",
      data: {
        projectType: newProjectType,
      },
    });
  } catch (err) {
    console.error("Error creating project type:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to create project type",
    });
  }
};

//get project type
exports.getProjectType = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "unauthorized user",
      });
    }

    const projectTypes = await ProjectType.find({ user: userId });
    return res.status(200).json({
      status: "success",
      data: {
        user: userId,
        projectTypes,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Controller to get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "unauthorized user",
      });
    }
    //
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: err.message });
  }
};

// create new project
exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, projectType } = req.body;
    if (!title || !description || !projectType) {
      return res.status(400).json({
        status: "failed",
        message: "title or description or project type is missing",
      });
    }
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(projectType);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "unauthorized user",
      });
    }
    const existingProjectType = await ProjectType.findOne({
      _id: objectId,
      user: userId,
    });
    if (!existingProjectType) {
      return res.status(404).json({
        status: "failed",
        message: "Project type not found for the current user",
      });
    }
    console.log("existing project type=======>", existingProjectType);

    const existingProject = await Project.findOne({ title, user: userId });
    if (existingProject) {
      return res.status(400).json({
        status: "failed",
        message: "A project with this title already exists for the user",
      });
    }

    const newProject = new Project({
      title,
      description,
      user: userId,
      projectType,
      tasks: [],
    });
    await newProject.save();
    return res.status(201).json({
      status: "success",
      message: "Project created successfully",
      data: {
        project: newProject,
      },
    });
  } catch (err) {
    console.error("Error creating project:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to create project",
    });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "unauthorized user",
      });
    }
    const projects = await Project.find({ user: userId })
      .populate("tasks")
      .populate("projectType");
    if (!projects) {
      return res
        .status(404)
        .json({ status: "failed", message: "something wrong here" });
    }

    return res.status(200).json({
      status: "success",
      data: {
        projects: projects,
      },
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch user projects",
    });
  }
};

//add new task to project
exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, projectId } = req.body;
    if (!title || !description || !projectId) {
      return res.status(400).json({
        status: "failed",
        message: "title or description or projectId is missing",
      });
    }
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(projectId);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "unauthorized user",
      });
    }
    const project = await Project.findOne({ _id: objectId, user: userId });
    if (!project) {
      return res.status(404).json({
        status: "failed",
        message: "Project not found for the current user",
      });
    }
    const existingTask = await Task.findOne({ title, project: projectId });
    if (existingTask) {
      return res.status(400).json({
        status: "failed",
        message: "A task with this title already exists in the project",
      });
    }
    const newTask = new Task({
      title,
      description,
      project: projectId,
    });
    const savedTask = await newTask.save();
    project.tasks.push(savedTask._id);
    await project.save();
    return res.status(201).json({
      status: "success",
      message: "Task created successfully",
      data: {
        task: savedTask,
      },
    });
  } catch (err) {
    console.error("Error creating task:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to create task",
    });
  }
};

//complete task
exports.completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "unauthorized user",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid taskId format",
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        status: "failed",
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);
    if (!project || project.user.toString() !== userId) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized to complete this task",
      });
    }

    task.isFinished = true;
    await task.save();

    return res.status(200).json({
      status: "success",
      message: "Task marked as completed",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Error completing task:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to complete task",
    });
  }
};

// uncomplete task
exports.incompleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "unauthorized user",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid taskId format",
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        status: "failed",
        message: "Task not found",
      });
    }
    const project = await Project.findById(task.project);
    if (!project || project.user.toString() !== userId) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized to uncomplete this task",
      });
    }

    task.isFinished = false;
    await task.save();

    return res.status(200).json({
      status: "success",
      message: "Task marked as incomplete",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Error marking task as incomplete:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to mark task as incomplete",
    });
  }
};
