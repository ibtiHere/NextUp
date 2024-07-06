const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectTypeSchema = new Schema({
  title: {
    type: String,
    required: true,
    // unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Ensure compound unique index on title and user
ProjectTypeSchema.index({ title: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("ProjectType", ProjectTypeSchema);
