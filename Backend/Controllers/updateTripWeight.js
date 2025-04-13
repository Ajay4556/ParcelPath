import Trip from "../Models/Trip.js";

export const updateTripWeight = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { weight } = req.body; // Weight in grams
    console.log(tripId);
    

    // Validate input
    if (!weight || weight <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid weight provided'
      });
    }

    // Find the trip
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    // Convert trip weight capacity to grams (from kg)
    const tripWeightCapacityInGrams = trip.weightCapacity * 1000;

    // Check if there's enough weight capacity
    if (weight > tripWeightCapacityInGrams) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient weight capacity'
      });
    }

    // Calculate new weight capacity (convert back to kg)
    const newWeightCapacity = (tripWeightCapacityInGrams - weight) / 1000;

    // Update the trip's weight capacity
    trip.weightCapacity = newWeightCapacity;

    // Check if the new weight capacity is zero and disable the trip if so
    if (newWeightCapacity === 0) {
      trip.isDisabled = true;
    }

    await trip.save();

    res.status(200).json({
      status: 'success',
      data: {
        trip
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};