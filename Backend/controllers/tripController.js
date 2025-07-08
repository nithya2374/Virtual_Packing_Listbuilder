import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  try {
    const newTrip = new Trip({ ...req.body, user: req.user.id });
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};