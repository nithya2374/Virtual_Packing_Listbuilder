import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {

  try {
    const newTrip = new Trip({
      type: req.body.type,
      destination: req.body.destination,
      duration: req.body.duration,
      user: req.user.userId, 
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } 
  catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    console.log("User from middleware:", req.user);
    const trips = await Trip.find({ user: req.user.userId });
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTrip = async (req, res) => {
  try {

    const trip = await Trip.findById(req.params.id);

    // Check if trip exists
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Check if the logged-in user is the owner
    if (trip.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this trip" });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedTrip);
  } 
  catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this trip" });
    }
    await trip.deleteOne();

    res.json({ message: "Trip deleted successfully" });
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};
