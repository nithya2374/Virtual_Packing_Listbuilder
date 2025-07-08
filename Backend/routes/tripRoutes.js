<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const Trip = require("./models/Trip");
const generateChecklist = require("../utils/generateChecklist");

router.get("/test", (req, res) => {
  res.send("Trip route is working!");
});

module.exports = router;
=======
import express from "express";
import { createTrip, getTrips, updateTrip } from "../controllers/tripController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.put("/:id", authMiddleware, updateTrip);

export default router;
>>>>>>> 7620fc01996a1249c84a7d5d15900a3887b8155b
