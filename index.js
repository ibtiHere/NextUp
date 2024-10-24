const express = require("express");
const app = express();
app.use(express.json());

const databaseConnection = require("./config/db");

databaseConnection();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("server is listning on port " + PORT);
});

const userRoute = require("./Routes/UserRoute");
app.use("/api/v1", userRoute);
