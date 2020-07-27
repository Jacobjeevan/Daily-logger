const mongoose = require("mongoose");
const task = require("./task");
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
  tasks: {
    type: Array,
  },
});

const Block = mongoose.model("Block", blockSchema);

module.exports = Block;
