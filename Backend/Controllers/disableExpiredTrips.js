import Trip from "../Models/Trip.js";

export const disableExpiredTrips = async (req, res) => {
  try {
    const now = new Date();
    // Calculate the start of the current day in UTC
    const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // Adjust the query to compare only the date part
    const result = await Trip.updateMany(
      {
        pickupDate: { $lt: startOfTodayUTC.toISOString().split('T')[0] }, // Compare only the date part
        isDisabled: { $ne: true },
      },
      {
        $set: { isDisabled: true },
      }
    );

    res.status(200).json({
      message: "Expired trips disabled successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to disable expired trips.",
      error: error.message,
    });
  }
};