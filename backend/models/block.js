const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  fromDay: {
    type: Date,
    required: true,
  },
  toDay: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  days: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Day",
    },
  ],
});

const Block = mongoose.model("Block", blockSchema);

module.exports = Block;
