const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const tasksRouter = require("./routes/tasks");
const blocksRouter = require("./routes/blocks");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/tasks", tasksRouter);
app.use("/blocks", blocksRouter);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established succesfully");
});

app.listen(port, () => {
  console.log(`Server is currently running on the port: ${port}`);
});
