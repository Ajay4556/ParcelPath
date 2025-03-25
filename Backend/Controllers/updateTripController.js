import Trip from "../Models/Trip.js";
import cloudinary from "../Config/cloudinary.js";
import { Readable } from "stream";

export const updateTripController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serviceProvider,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      weightCapacity,
      price,
      description,
      deliveryType,
    } = req.body;

    let updateData = {
      serviceProvider,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      weightCapacity,
      price,
      description,
      deliveryType,
    };

    if (req.file) {
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "parcelpath" },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result);
          }
        );
        bufferStream.pipe(uploadStream);
      });

      updateData.image = result.public_id;
    }

    const updatedTrip = await Trip.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    res.status(200).json({ message: "Trip updated successfully!", trip: updatedTrip });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};