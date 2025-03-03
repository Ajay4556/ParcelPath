import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required.'],
  },
  serviceProvider: {
    type: String,
    required: [true, 'Service Provider is required.'],
  },
  dropoffLocation: {
    type: String,
    required: [true, 'Drop off location is required.'],
  },
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required.'],
  },
  dropoffDate: {
    type: Date,
    required: [true, 'Drop off date is required.'],
  },
  pickupTime: {
    type: String,
    required: [true, 'Pickup time is required.'],
  },
  dropoffTime: {
    type: String,
    required: [true, 'Drop off time is required.'],
  },
  weightCapacity: {
    type: Number,
    required: [true, 'Weight capacity is required.'],
    min: [0, 'Weight capacity must be a positive number.'],
  },
  price: {
    type: Number,
    required: [true, 'Price per 100gm is required.'],
    min: [0, 'Price must be a positive number.'],
  },
  description: {
    type: String,
    required: [true, 'Trip description is required.'],
  },
  image: {
    type: String,
    required: [true, 'Vehicle Image is required.'],
  },
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;