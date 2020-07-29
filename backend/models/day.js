const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const daySchema = new Schema({
  calendarDate: {
    type: Date,
    required: true,
    unique: true,
  },
  blocks: Array,
});

const Day = mongoose.model("Day", daySchema);

module.exports = Day;
