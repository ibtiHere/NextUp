const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env);
const db = process.env.DATABASEURL;
console.log("database ==>", db);
const databaseConnection = () => {
  mongoose
    .connect(db)
    .then(() => {
      console.log("database connection established");
    })
    .catch((e) => {
      console.log("Database connection error:", e.message);
    });
};
module.exports = databaseConnection;
