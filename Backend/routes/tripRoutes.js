const express = require("express");
const router = express.Router();
const Trip = require("./models/Trip");
const generateChecklist = require("../utils/generateChecklist");

router.get("/test", (req, res) => {
  res.send("Trip route is working!");
});

module.exports = router;
