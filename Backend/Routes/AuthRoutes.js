import express from "express";
import dotenv from "dotenv";
import { ExpressAuth } from "@auth/express";
import GoogleProvider from "@auth/express/providers/google";
import FacebookProvider from "@auth/express/providers/facebook";
import { loginController } from "../Controllers/LoginController.js";
import { signupController } from "../Controllers/SignUpController.js";
import { getSingleUser } from "../Controllers/getSingleUser.js";
import { validateSignup, validateLogin } from "../middleware/validator.js";
import socialUserSchema from "../Models/SocialUserSchema.js";
import { generateToken } from "../Utils/generateToken.js";
import { getUserByEmailController } from "../Controllers/getUserByEmailController.js"; 
import upload from "../middleware/upload.js";
import { deleteUserController } from "../Controllers/deleteUserController.js";
import { submitReview } from "../Controllers/submitReview.js";
dotenv.config();

const frontendUrl = process.env.FRONTEND_BASE_URL;


const router = express.Router();

// Google Authentication Route
router.use(
  "/google/*",
  ExpressAuth({
    baseUrl: process.env.BASE_URL,
    providers: [
      GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
      signIn: async ({ user, account, profile, email, credentials }) => {
        try {
          let existingUser = await socialUserSchema.findOne({
            email: profile.email,
          });

          if (!existingUser) {
            existingUser = new socialUserSchema({
              fullName: profile.name,
              email: profile.email,
              role: "consumer",
              provider: "google",
              providerId: profile.sub,
            });
          }
          console.log(existingUser);
          // Generate a token
          const token = generateToken(existingUser._id);

          // Update the user's token in the database
          existingUser.token = token;
          await existingUser.save();

          // Return user details and token
          return {
            success: true,
            user: {
              id: existingUser._id,
              fullName: existingUser.fullName,
              email: existingUser.email,
              role: existingUser.role,
              createdAt: existingUser.createdAt,
            },
            token,
          };
        } catch (error) {
          console.error("Google sign-in error:", error);
          return { success: false, message: "Google sign-in failed" };
        }
      },
      redirect: async (url, baseUrl) => {
        return `${frontendUrl}/dashboard`;
      },
    },
  })
);

// Facebook Authentication Route
router.use(
  "/facebook/*",
  ExpressAuth({
    providers: [
      FacebookProvider({
        clientId: process.env.AUTH_FACEBOOK_ID,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
      signIn: async ({ user, account, profile, email, credentials }) => {
        try {
          let existingUser = await socialUserSchema.findOne({
            email: profile.email,
          });

          console.log(profile);
          if (!existingUser) {
            // Create a new user if not found
            existingUser = new socialUserSchema({
              fullName: profile.name,
              email: profile.email,
              role: "consumer", // Default role, adjust as needed
              provider: "facebook",
              providerId: profile.id, // Assuming profile.id is the unique ID from Facebook
            });
            await existingUser.save();
          }

          // Generate a token
          const token = generateToken(existingUser._id);

          // Return user details and token
          return {
            success: true,
            user: {
              id: existingUser._id,
              fullName: existingUser.fullName,
              email: existingUser.email,
              role: existingUser.role,
              createdAt: existingUser.createdAt,
            },
            token,
          };
        } catch (error) {
          console.error("Facebook sign-in error:", error);
          return { success: false, message: "Facebook sign-in failed" };
        }
      },
      redirect: async (url, baseUrl) => {
        return `${frontendUrl}/dashboard`;
      },
    },
  })
);

// Signup Route
router.post("/signup", upload.fields([{ name: 'gLicense' }, { name: 'companyRegistration' }, { name: "profileImage" }]), validateSignup, signupController);

// Login Route
router.post("/login", validateLogin, loginController);

router.get("/user/:userId", getSingleUser);
router.delete("/deleteUser/:id", deleteUserController);
router.get('/user/email/:email', getUserByEmailController);
router.post('/submitReview', submitReview);

export default router;
