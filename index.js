const express = require("express");
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("images"));


const databaseConnection = require("./config/db");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

databaseConnection();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("server is listning on port " + PORT);
});

const userRoute = require("./Routes/UserRoute");
app.use("/api/v1", userRoute);
