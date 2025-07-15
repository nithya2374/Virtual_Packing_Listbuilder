import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  try {
    const newTrip = new Trip({
      type: req.body.type,
      destination: req.body.destination,
      days: req.body.days,
      user: req.user.userId, 
    });

    await newTrip.save();
    console.log( "REQ.USER in tripController:", req.user); 
    res.status(201).json(newTrip);
  } 
  catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const getlatestTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.userId }).sort({ createdAt: -1 });
    if (!trips.length) return res.status(404).json({ message: "No trips found" });
    res.status(200).json(trips[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch latest trip" });
  }
};

export const updateTrip = async (req, res) => {
  try {

    const tripId = req.params.id;

    // Optional: ensure this trip belongs to the current user
    const trip = await Trip.findOne({ _id: tripId, user: req.user.userId });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized" });
    }

    // Update only the fields provided
    if (req.body.notes) trip.notes = req.body.notes;
    if (req.body.packedItems) trip.packedItems = req.body.packedItems;
    if (req.body.customItems) trip.customItems = req.body.customItems;

    await trip.save();
    res.json({ message: "Trip updated successfully", trip });
  } catch (err) {
    console.error("Update trip error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this trip" });
    }
    await trip.deleteOne();

    res.json({ message: "Trip deleted successfully" });
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getallTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({ message: "Server error while fetching trips" });
  }
};
