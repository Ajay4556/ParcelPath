import Trip from "../Models/Trip.js";
import Checkout from "../Models/Checkout.js";
import User from "../Models/User.js";
import { sendEmail } from "../Utils/email.js";

export const deleteTripController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTrip = await Trip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    // Fetch checkouts and notify users
    const checkouts = await Checkout.find({ tripId: id });
    const userIds = checkouts.map(checkout => checkout.userId);
    const users = await User.find({ _id: { $in: userIds } });

    users.forEach(user => {
      const emailText = `Unfortunately, the trip you booked has been cancelled. Here were the details:\n\nPickup Location: ${deletedTrip.pickupLocation}\nDropoff Locations: ${deletedTrip.dropoffLocations.join(', ')}\nPickup Date: ${deletedTrip.pickupDate}\nDropoff Date: ${deletedTrip.dropoffDate}\nService Provider: ${deletedTrip.serviceProvider}`;
      sendEmail(user.email, 'Trip Cancelled', emailText);
    });

    res.status(200).json({ message: "Trip deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};