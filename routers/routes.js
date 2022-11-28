const express = require("express");
const router = express.Router();
const Crud = require("../models/crud");

router.get("/", async (req, res) => {
  try {
    const crud = await Crud.find();
    res.json(crud);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const getCrud = await Crud.findOne({ _id: id });
    if (!getCrud) {
      const error = new Error("Does not exist");
      return next(error);
    }
    res.json(getCrud);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res) => {
  const crud = new Crud({
    name: req.body.name,
    tech: req.body.tech,
    sub: req.body.sub,
  });
  try {
    const db = await crud.save();
    res.json(db);
  } catch (error) {
    res.send("Error");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const edit = await Crud.findById(req.params.id);
    edit.sub = req.body.sub;
    const editTask = await edit.save();
    res.json(editTask);
  } catch (error) {
    res.send("Error", error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const crud = await Crud.findOne({ _id: id });
    if (!crud) {
      return next();
    }
    await Crud.remove({ _id: id });
    res.json({ message: "data deleted" });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
