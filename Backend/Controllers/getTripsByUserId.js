import Trip from "../Models/Trip.js";
import { getCloudinaryImageUrl } from "../Utils/cloudinaryUtil.js";

export const getTripsByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const tripDoc = await Trip.find({ userId: id });

    // Check if no trips were found
    if (!tripDoc || tripDoc.length === 0) {
      return res.status(404).json({ message: "Trips not found" });
    }

    // Map through each trip and modify the image URL
    const tripArray = tripDoc.map((trip) => {
      const tripObj = trip.toObject();
      tripObj.image = getCloudinaryImageUrl(tripObj.image);
      return tripObj;
    });

    res.status(200).json(tripArray);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error });
  }
};