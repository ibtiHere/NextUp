const express = require("express");
const app = express();
app.use(express.json());

const databaseConnection = require("./config/db");

databaseConnection();

app.listen(process.env.PORT, () => {
  console.log("server is listning on port 5000");
});

const userRoute = require("./Routes/UserRoute");
app.use("/api/v1", userRoute);
