const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const db = process.env.DATABASE_URL;

const databaseConnection = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("database connection established");
    })
    .catch((e) => {
      console.log("Database connection error:", e.message);
    });
};
module.exports = databaseConnection;
