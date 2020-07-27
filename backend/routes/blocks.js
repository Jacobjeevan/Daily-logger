const router = require("express").Router();
let Block = require("../models/block");

router.route("/").get((req, res) => {
  Block.find()
    .then((blocks) => res.json(blocks))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const fromDay = req.body.fromDay;
  const toDay = req.body.toDay;
  const name = req.body.name;
  const duration = req.body.duration;
  const tasks = req.body.tasks;
  const newBlock = new Block({ fromDay, toDay, name, duration, tasks });
  newBlock
    .save()
    .then(() => res.json("Block Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Block.findByIdAndDelete(req.params.id)
    .then(() => res.json("Block deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Block.findById(req.params.id)
    .then((block) => {
      block.fromDay = Date.parse(req.body.fromDay);
      block.toDay = Date.parse(req.body.toDay);
      block.name = req.body.name;
      block.duration = req.body.duration;
      block.tasks = req.body.tasks;
      block
        .save()
        .then(() => res.json("block Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
