import Trip from "../Models/Trip.js";
import Checkout from "../Models/Checkout.js";
import User from "../Models/User.js";
import cloudinary from "../Config/cloudinary.js";
import { Readable } from "stream";
import { sendEmail } from "../Utils/email.js";

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

    // Fetch checkouts and notify users
    const checkouts = await Checkout.find({ tripId: id });
    const userIds = checkouts.map(checkout => checkout.userId);
    const users = await User.find({ _id: { $in: userIds } });

    users.forEach(user => {
      const emailText = `The trip you booked has been updated. Here are the new details:\n\nPickup Location: ${updatedTrip.pickupLocation}\nDropoff Locations: ${updatedTrip.dropoffLocations.join(', ')}\nPickup Date: ${updatedTrip.pickupDate}\nDropoff Date: ${updatedTrip.dropoffDate}\nService Provider: ${updatedTrip.serviceProvider}`;
      sendEmail(user.email, 'Trip Updated', emailText);
    });

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