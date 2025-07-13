import express from "express";
import { createTrip, getTrips, updateTrip, deleteTrip } from "../controllers/tripController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post("/", authMiddleware, [

    body("type").notEmpty().withMessage("Triptype is required"),
    body("destination").notEmpty().withMessage("Destination is required"),
    body("duration").isInt({min:1}).withMessage("Duration must be no of days"),

  ],(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    createTrip(req, res); 

  });

router.get("/", authMiddleware, getTrips);
router.put("/:id", authMiddleware, updateTrip);
router.delete("/:id",authMiddleware, deleteTrip);

export default router;
