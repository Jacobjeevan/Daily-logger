const router = require("express").Router();
let Task = require("../models/task");

router.route("/").get((req, res) => {
  Task.find()
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const duration = req.body.duration;
  const description = req.body.description;
  const status = req.body.status;
  const block = req.body.block;
  const newTask = new Task({ name, duration, description, status });
  if (block) {
    block.tasks.push(newTask.id);
    newTask.blocks = block.id;
    block
      .save()
      .then(() => console.log("Block saved"))
      .catch((err) => console.log("Block save error"));
  }
  newTask
    .save()
    .then(() => res.json("Task Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Task.findByIdAndDelete(req.params.id)
    .then((task) => {
      blocks = task.blocks;
      for (block of blocks) {
        block.tasks = block.tasks.filter(
          (taskID) => String(taskID) !== String(task.id)
        );
        block
          .save()
          .then(() => console.log("Block Tasks Updated"))
          .catch((err) => console.log("Error: " + err));
      }
      return res.json("Task deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      task.name = req.body.name;
      task.duration = req.body.duration;
      task.description = req.body.description;
      task.status = req.body.status;
      task
        .save()
        .then(() => res.json("Task Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
