const express = require("express");
const app = express();
app.use(express.json());

const databaseConnection = require("./config/db");

databaseConnection();
<<<<<<< HEAD
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("server is listning on port " + PORT);
=======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
>>>>>>> origin/main
});

const userRoute = require("./Routes/UserRoute");
app.use("/api/v1", userRoute);
