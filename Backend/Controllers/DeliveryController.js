import RecentDelivery from "../models/RecentDelivery.js";

export const getRecentDeliveries = async (req, res) => {
  try {
    const deliveries = await RecentDelivery.find();
    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching recent deliveries:", error);
    res.status(500).json({ message: "Server error" });
  }
};
