const express = require("express");
const app = express();
app.use(express.json());

const databaseConnection = require("./config/db");

databaseConnection();
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log("server is listning on port 5000");
});

const userRoute = require("./Routes/UserRoute");
app.use("/api/v1", userRoute);
