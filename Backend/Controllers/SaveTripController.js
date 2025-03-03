import Trip from "../Models/Trip.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const saveTripController = async (req, res) => {
  try {
    const {
      pickupLocation,
      serviceProvider,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      weightCapacity,
      price,
      description,
    } = req.body;

    let cloudinaryPublicId = "";

    if (req.file) {
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);

      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "parcelpath" },
          (error, result) => {
            if (error) return reject(error);
            cloudinaryPublicId = result.public_id;
            return resolve(result);
          }
        );
        bufferStream.pipe(uploadStream);
      });
    }

    const trip = new Trip({
      pickupLocation,
      serviceProvider,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      weightCapacity,
      price,
      description,
      image: cloudinaryPublicId,
    });

    await trip.save();
    res.status(201).json({ message: "Trip created successfully!", trip });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
