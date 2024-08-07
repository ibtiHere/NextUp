const express = require("express");
const app = express();
app.use(express.json());

const databaseConnection = require("./config/db");

databaseConnection();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const userRoute = require("./Routes/UserRoute");
app.use("/api/v1", userRoute);
