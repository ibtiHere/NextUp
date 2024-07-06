const mongoose = require("mongoose");

const OTPSchema = mongoose.Schema({
  identity: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
    // default: "",
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 900,
  },
});
module.exports = mongoose.model("OTPSchema", OTPSchema);
