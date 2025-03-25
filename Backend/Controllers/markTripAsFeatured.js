import Trip from "../Models/Trip.js";

export const markTripAsFeatured = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { isFeatured: true },
      { new: true, runValidators: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ success: false, message: "Trip not found." });
    }

    res.status(200).json({
      success: true,
      message: "Trip marked as featured successfully.",
      data: updatedTrip,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markTripAsUnFeatured = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedTrip = await Trip.findByIdAndUpdate(
        id,
        { isFeatured: false },
        { new: true, runValidators: true }
      );
  
      if (!updatedTrip) {
        return res.status(404).json({ success: false, message: "Trip not found." });
      }
  
      res.status(200).json({
        success: true,
        message: "Trip marked as unfeatured successfully.",
        data: updatedTrip,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
