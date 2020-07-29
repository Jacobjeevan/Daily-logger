const router = require("express").Router();
let Block = require("../models/block");
let Day = require("../models/day");

router.route("/").get((req, res) => {
  Block.find()
    .then((blocks) => res.json(blocks))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const fromDay = Date.parse(req.body.fromDay);
  const toDay = Date.parse(req.body.toDay);
  const name = req.body.name;
  const duration = req.body.duration;
  const tasks = req.body.tasks;

  const newBlock = new Block({ fromDay, toDay, name, duration, tasks });
  newBlock
    .save()
    .then(() => res.json("Block Added"))
    .catch((err) => res.status(400).json("Error: " + err));

  for (let curDay = fromDay; curDay <= toDay; curDay = curDay + 86400000) {
    Day.findOne({ calendarDate: curDay })
      .then((res) => {
        if (!res) {
          const newDay = new Day({ calendarDate: curDay, blocks: [newBlock] });
          newDay
            .save()
            .then(() => console.log("Day Created"))
            .catch((err) => res.status(400).json("New Day Save Error: " + err));
        } else {
          res.calendarDate = res.calendarDate;
          res.blocks = [...res.blocks, newBlock];
          res
            .save()
            .then(() => console.log("Day Updated"))
            .catch((err) =>
              res.status(400).json("Existing Days Save Error: " + err)
            );
        }
      })
      .catch((err) => console.log(err));
  }
});

function updateBlockInDays(blockInfo) {
  let { fromDay, toDay, id, block } = blockInfo;
  for (; fromDay <= toDay; fromDay = fromDay + 86400000) {
    Day.findOne({ calendarDate: fromDay })
      .then((res) => {
        if (!res) {
          return res.status(400).json("Day Fetch Error: " + err);
        } else {
          res.calendarDate = res.calendarDate;
          res.blocks = res.blocks.filter((blocks) => blocks.id !== id);
          if (block) {
            res.blocks = [...res.blocks, block];
          }
          res
            .save()
            .then(() => console.log("Day Updated"))
            .catch((err) => res.status(400).json("Day Save Error: " + err));
        }
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
}

router.route("/:id").delete((req, res) => {
  let id = req.params.id;
  Block.findById(id)
    .then((block) => {
      const fromDay = block.fromDay.getTime();
      const toDay = block.toDay.getTime();
      let blockInfo = {
        id,
        fromDay,
        toDay,
      };
      updateBlockInDays(blockInfo);
    })
    .catch((err) => res.status(400).json("Block Fetch Error: " + err));

  Block.findByIdAndDelete(id)
    .then(() => res.json("Block deleted"))
    .catch((err) => res.status(400).json("Block Delete Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  let id = req.params.id;
  Block.findById(id)
    .then((block) => {
      let prevfromDay = block.fromDay.getTime();
      let prevtoDay = block.toDay.getTime();
      let newfromDay = Date.parse(req.body.fromDay);
      let newToDay = Date.parse(req.body.toDay);
      block.fromDay = Date.parse(req.body.fromDay);
      block.toDay = Date.parse(req.body.toDay);
      block.name = req.body.name;
      block.duration = req.body.duration;
      block.tasks = req.body.tasks;
      block
        .save()
        .then(() => res.json("block Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
      updateBlockInDays({ fromDay: newfromDay, toDay: newToDay, id, block });
      if (newfromDay > prevfromDay) {
        updateBlockInDays({
          fromDay: prevfromDay,
          toDay: newfromDay - 86400000,
          id,
        });
      }
      if (newToDay < prevtoDay) {
        updateBlockInDays({
          fromDay: newToDay + 86400000,
          toDay: prevtoDay,
          id,
        });
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
