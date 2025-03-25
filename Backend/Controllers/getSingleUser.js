// Controllers/UserController.js
import User from "../Models/User.js";
import { getCloudinaryImageUrl } from "../Utils/cloudinaryUtil.js";

export const getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let image;

    if(user.profileImage) {
      image = getCloudinaryImageUrl(user.profileImage);
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role:user.role,
        isVerified: user.isVerified,
        profileImage: image || ""
      },
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};