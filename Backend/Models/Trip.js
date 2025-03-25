import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User ID is required."],
    ref: "User",
  },
  pickupLocation: {
    type: String,
    required: [true, "Pickup location is required."],
  },
  serviceProvider: {
    type: String,
    required: [true, "Service Provider is required."],
  },
  dropoffLocations: {
    type: [
      {
        type: String,
        required: [true, "Drop off location cannot be empty."],
      },
    ],
    validate: {
      validator: function (v) {
        return v.length > 0; // Check if the array is not empty
      },
      message: "At least one drop-off location is required.",
    },
  },

  pickupDate: {
    type: Date,
    required: [true, "Pickup date is required."],
  },
  dropoffDate: {
    type: Date,
    required: [true, "Drop off date is required."],
  },
  pickupTime: {
    type: String,
    required: [true, "Pickup time is required."],
  },
  dropoffTime: {
    type: String,
    required: [true, "Drop off time is required."],
  },
  weightCapacity: {
    type: Number,
    required: [true, "Weight capacity is required."],
    min: [0, "Weight capacity must be a positive number."],
  },
  price: {
    type: Number,
    required: [true, "Price per 100gm is required."],
    min: [0, "Price must be a positive number."],
  },
  description: {
    type: String,
    required: [true, "Trip description is required."],
  },
  image: {
    type: String,
    required: [true, "Vehicle Image is required."],
  },
  deliveryType: {
    type: String,
    required: [true, "Delivery type is required."],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
