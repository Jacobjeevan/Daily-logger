const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      select: ["yes", "no", "maybe", "disabled"],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
