import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import cloudinary from "../Config/cloudinary.js";
import { Readable } from "stream";

dotenv.config();

export const signupController = async (req, res) => {
  try {
    const { fullName, email, password, phonenumber, city, address, role } =
      req.body;
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please log in.",
      });
    }

    // Validate files for service providers
    if (role === "service provider") {
      if (!req.files || !req.files.gLicense || !req.files.companyRegistration) {
        return res.status(400).json({
          success: false,
          message:
            "Service providers must upload both G License and Company Registration files.",
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let gLicenseImage = "";
    let companyRegistrationImage = "";
    let profilePicture = "";
    const { profileImage } = req?.files;

    if (req.files && profileImage) {
      if (profileImage) {
        profilePicture = await uploadToCloudinary(profileImage[0]);
      }
    }

    // Upload images if the role is service provider
    if (role === "service provider" && req.files) {
      const { gLicense, companyRegistration } = req.files;

      if (gLicense) {
        gLicenseImage = await uploadToCloudinary(gLicense[0]); // Access the first file in the array
      }

      if (companyRegistration) {
        companyRegistrationImage = await uploadToCloudinary(
          companyRegistration[0]
        ); // Access the first file in the array
      }
    }

    // Create new user with the new fields including role and isVerified
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phonenumber,
      city,
      address,
      role,
      gLicenseImage,
      companyRegistrationImage,
      profileImage: profilePicture,
      isVerified: role === "service provider" ? false : true, // Set isVerified to false for service providers
    });

    // Save user to the database
    await newUser.save();

    // Generate JWT token
    // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    //   expiresIn: "10h",
    // });

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Sign Up Successful",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phonenumber: newUser.phonenumber,
        city: newUser.city,
        address: newUser.address,
        role: newUser.role,
        isVerified: newUser.isVerified,
        gLicenseImage: newUser.gLicenseImage,
        companyRegistrationImage: newUser.companyRegistrationImage,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Helper function to upload a file to Cloudinary
const uploadToCloudinary = async (file) => {
  const bufferStream = new Readable();
  bufferStream.push(file.buffer);
  bufferStream.push(null);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "parcelpath" },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result.public_id);
      }
    );
    bufferStream.pipe(uploadStream);
  });
};
