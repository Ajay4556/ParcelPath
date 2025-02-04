// models/RecentDelivery.js
import mongoose from "mongoose";

const recentDeliverySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

const RecentDelivery = mongoose.model("RecentDeliveries", recentDeliverySchema);
export default RecentDelivery;
