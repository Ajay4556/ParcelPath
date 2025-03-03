import Trip from "../Models/Trip.js";
import { getCloudinaryImageUrl } from "../Utils/cloudinaryUtil.js";

export const getTripByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const tripDoc = await Trip.findById(id);

    if (!tripDoc) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const tripObj = tripDoc.toObject();

    tripObj.image = getCloudinaryImageUrl(tripObj.image);

    res.status(200).json(tripObj);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trip", error });
  }
};
