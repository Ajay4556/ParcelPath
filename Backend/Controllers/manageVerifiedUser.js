import User from "../Models/User.js";
import { getCloudinaryImageUrl } from "../Utils/cloudinaryUtil.js"; // Ensure this utility is correctly implemented

export const fetchUnverifiedProviders = async (req, res) => {
  try {
    const users = await User.find({ role: "service provider", isVerified: false });

    // Transform users to include full image URLs
    const transformedUsers = users.map((user) => {
      const userObj = user.toObject();
      userObj.gLicenseImage = getCloudinaryImageUrl(userObj.gLicenseImage);
      userObj.companyRegistrationImage = getCloudinaryImageUrl(userObj.companyRegistrationImage);

      return userObj;
    });

    res.status(200).json(transformedUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const verifyProvider = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Transform the updated user to include full image URLs
    const updatedUserObj = updatedUser.toObject();
    updatedUserObj.gLicenseImage = getCloudinaryImageUrl(updatedUserObj.gLicenseImage);
    updatedUserObj.companyRegistrationImage = getCloudinaryImageUrl(updatedUserObj.companyRegistrationImage);

    res.status(200).json({
      success: true,
      message: "User Verified successfully.",
      data: updatedUserObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};