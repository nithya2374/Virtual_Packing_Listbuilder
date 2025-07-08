import express from "express";
import { createTrip, getTrips, updateTrip } from "../controllers/tripController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.put("/:id", authMiddleware, updateTrip);

export default router;