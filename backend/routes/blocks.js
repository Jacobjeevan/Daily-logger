const router = require("express").Router();
let Block = require("../models/block");
let Day = require("../models/day");

router.route("/").get((req, res) => {
  Block.find()
    .then((blocks) => res.json(blocks))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Block.findById(id)
    .then((block) => res.json(block))
    .catch((err) => res.status(400).json("Block Fetch Error: " + err));
});

router.route("/add").post(async (req, res) => {
  const fromDay = Date.parse(req.body.fromDay);
  const toDay = Date.parse(req.body.toDay);
  const name = req.body.name;
  const duration = req.body.duration;
  const tasks = req.body.tasks;
  const newBlock = new Block({ fromDay, toDay, name, duration, tasks });
  allDays = [];
  for (let curDay = fromDay; curDay <= toDay; curDay = curDay + 86400000) {
    await Day.findOne({ calendarDate: curDay }, function (err, res) {
      if (err) res.status(400).json(err);
      if (!res) {
        const newDay = new Day({
          calendarDate: curDay,
          blocks: [newBlock.id],
        });
        newDay
          .save()
          .then(() => console.log("Day Created"))
          .catch((err) => res.status(400).json("New Day Save Error: " + err));
        allDays.push(newDay.id);
      } else {
        res.calendarDate = res.calendarDate;
        res.blocks = [...res.blocks, newBlock.id];
        res
          .save()
          .then(() => console.log("Day Updated"))
          .catch((err) =>
            res.status(400).json("Existing Days Save Error: " + err)
          );
        allDays.push(res.id);
      }
    });
  }
  newBlock.days = allDays;
  newBlock
    .save()
    .then(() => res.json("Block Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post(async (req, res) => {
  let id = req.params.id;
  await Block.findById(id)
    .then((block) => {
      DaysInfo = {
        newfromDay: Date.parse(req.body.fromDay),
        newToDay: Date.parse(req.body.toDay),
        prevfromDay: block.fromDay.getTime(),
        prevtoDay: block.toDay.getTime(),
        id,
        allDays: block.days,
      };
      block.fromDay = Date.parse(req.body.fromDay);
      block.toDay = Date.parse(req.body.toDay);
      block.name = req.body.name;
      block.duration = req.body.duration;
      block.tasks = req.body.tasks;
      UpdateAllDays(DaysInfo, block);
      block
        .save()
        .then(() => res.json("block Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete(async (req, res) => {
  let id = req.params.id;
  await Block.findByIdAndDelete(id)
    .then((block) => {
      const fromDay = block.fromDay.getTime();
      const toDay = block.toDay.getTime();
      let blockInfo = {
        id,
        fromDay,
        toDay,
      };
      updateBlockInDays(blockInfo, removeBlockFromDays, block);
      return res.json("Block deleted");
    })
    .catch((err) => res.status(400).json("Block Delete Error: " + err));
});

function addBlocktoDays(res, id) {
  res.blocks = [...res.blocks, id];
}

function removeBlockFromDays(res, id) {
  res.blocks = res.blocks.filter((blockIDs) => String(blockIDs) !== String(id));
}

const updateBlockInDays = async (blockInfo, updateFunction, block) => {
  let { fromDay, toDay, id, UpdateCase } = blockInfo;
  for (; fromDay <= toDay; fromDay = fromDay + 86400000) {
    try {
      await Day.findOne({ calendarDate: fromDay })
        .then((res) => {
          if (!res) {
            const newDay = new Day({
              calendarDate: fromDay,
              blocks: [id],
            });
            newDay
              .save()
              .then(() => console.log("Day Created"))
              .catch((err) =>
                res.status(400).json("New Day Save Error: " + err)
              );
            block.days = [...block.days, newDay.id];
          } else {
            res.calendarDate = res.calendarDate;
            switch (UpdateCase) {
              case "ADD":
                if (!block.days.includes(res.id)) {
                  block.days = [...block.days, res.id];
                }
              case "REMOVE":
                block.days = block.days.filter((dayID) => dayID !== res.id);
            }
            updateFunction(res, id);
            res
              .save()
              .then(() => console.log("Day Updated"))
              .catch((err) => console.log("Day Save Error: " + err));
          }
        })
        .catch((err) => console.log("Error: " + err));
    } catch (error) {
      console.log(error);
    }
  }
};

const UpdateAllDays = async (DaysInfo, block) => {
  let { newfromDay, newToDay, prevfromDay, prevtoDay, id } = DaysInfo;
  try {
    if (newfromDay > prevfromDay) {
      await updateBlockInDays(
        {
          fromDay: prevfromDay,
          toDay: newfromDay - 86400000,
          id,
          UpdateCase: "REMOVE",
        },
        removeBlockFromDays,
        block
      );
    } else if (newfromDay < prevfromDay) {
      await updateBlockInDays(
        {
          fromDay: newfromDay,
          toDay: prevfromDay - 86400000,
          id,
          UpdateCase: "ADD",
        },
        addBlocktoDays,
        block
      );
    }
    if (newToDay < prevtoDay) {
      await updateBlockInDays(
        {
          fromDay: newToDay + 86400000,
          toDay: prevtoDay,
          id,
          UpdateCase: "REMOVE",
        },
        removeBlockFromDays,
        block
      );
    } else if (newToDay > prevtoDay) {
      await updateBlockInDays(
        {
          fromDay: prevtoDay + 86400000,
          toDay: newToDay,
          id,
          UpdateCase: "ADD",
        },
        addBlocktoDays,
        block
      );
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = router;
