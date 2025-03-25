import express from "express";
import { getRecentDeliveries } from "../Controllers/DeliveryController.js";
import { saveTripController } from "../Controllers/SaveTripController.js";
import { getTripsController } from "../Controllers/getTripsController.js";
import upload from "../middleware/upload.js";
import { getTripByIdController } from "../Controllers/getTripByIdController.js";
import { checkoutController } from "../Controllers/checkoutController.js";
import { fetchFeaturedTrips } from "../Controllers/fetchFeaturedTrips.js";
import { getUserTripsController } from "../Controllers/getUserTripsController.js";
import { getTripsByUserId } from "../Controllers/getTripsByUserId.js";

const router = express.Router();

router.get("/recent-deliveries", getRecentDeliveries);
router.post("/trips", upload.single("vehicleImage"), saveTripController);
router.get("/trips", getTripsController);
router.get("/trips/:id", getTripByIdController);
router.get("/trips/user/:id", getTripsByUserId)
router.post("/checkout", checkoutController);
router.get("/featured-trips", fetchFeaturedTrips);
router.get('/user/:userId/trips', getUserTripsController);

export default router;
