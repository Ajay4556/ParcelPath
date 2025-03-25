import Checkout from '../Models/Checkout.js';
import { getCloudinaryImageUrl } from '../Utils/cloudinaryUtil.js';

export const getUserTripsController = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all checkouts for the user
    const checkouts = await Checkout.find({ userId }).populate('tripId');
    

    const currentTrips = [];
    const completedTrips = [];
    const today = new Date();

    // Categorize trips based on the drop-off date
    checkouts.forEach(checkout => {
      const trip = checkout.tripId;
      const image = getCloudinaryImageUrl(trip.image);
      const tripsWithImg = {
        ...trip.toObject(),
        image
      }
      
      if (tripsWithImg && tripsWithImg.dropoffDate) {
        if (tripsWithImg.dropoffDate > today) {
          currentTrips.push(tripsWithImg);
        } else {
          completedTrips.push(tripsWithImg);
        }
      }
    });

    return res.json({
      success: true,
      currentTrips,
      completedTrips,
      checkOutData: checkouts
    });
  } catch (error) {
    console.error('Error fetching user trips:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};