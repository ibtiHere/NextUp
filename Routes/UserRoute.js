const express = require("express");
const {
  requestAccount,
  verifyOtp,
  signUp,
  login,
  forgetPassword,
  verfiyOTPForgetPass,
  setNewPassword,
  // addNewProject,
  getUserById,
  createProjectType,
  getProjectType,
  createProject,
  getMyProjects,
  createTask,
  completeTask,
  incompleteTask,
  deleteTask,
  deleteProject,
  editProjectDetails,
  editUserProfile,
  changePassword,
  updateUserProfileImage,
  deleteProjectType,
  changeTaskPosition,
} = require("../Controllar/UserControllar");
const auth = require("../Middlewares/auth");
const upload = require("../Middlewares/multer");

const Router = express.Router();
//Routes
Router.post("/request-account", requestAccount);
Router.post("/verify-OTP", verifyOtp);
Router.post("/signup", signUp);
Router.post("/login", login);
Router.post("/forget-password", forgetPassword);
Router.post("/forgetpassword_otp", verfiyOTPForgetPass);
Router.post("/setnewpassword", setNewPassword);
// Router.post("/create-project", auth, addNewProject);
Router.get("/users/:id", auth, getUserById);

/////////
Router.post("/project-type", auth, createProjectType);
Router.get("/project-type", auth, getProjectType);
Router.post("/projects", auth, createProject);
Router.get("/projects", auth, getMyProjects);
Router.post("/task", auth, createTask);
Router.put("/task/:id/complete", auth, completeTask);
Router.put("/task/:id/incomplete", auth, incompleteTask);
Router.delete("/tasks/:id", auth, deleteTask);
Router.delete("/projects/:id", auth, deleteProject);
Router.put("/edit-project/:id", auth, editProjectDetails);
Router.put("/edit-profile", auth, editUserProfile);

// change task position
Router.post("/change-task-position", auth, changeTaskPosition);
// detele projecttype
Router.delete("/delete-projectType/:id", auth, deleteProjectType);
Router.post("/change-password", auth, changePassword);
Router.put(
  "/update-profile-image",
  auth,
  upload.single("image"),
  updateUserProfileImage
);

//

module.exports = Router;
