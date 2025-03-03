import Trip from "../Models/Trip.js";
import { getCloudinaryImageUrl } from "../Utils/cloudinaryUtil.js";

export const getTripsController = async (req, res) => {
  try {
    const trips = await Trip.find();

    const transformedTrips = trips.map((trip) => {
      const tripObj = trip.toObject();
      tripObj.image = getCloudinaryImageUrl(tripObj.image);

      return tripObj;
    });

    res.status(200).json(transformedTrips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error });
  }
};
