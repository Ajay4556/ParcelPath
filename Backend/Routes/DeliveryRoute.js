import express from "express";
import { getRecentDeliveries } from "../Controllers/DeliveryController.js";
import { saveTripController } from "../Controllers/SaveTripController.js";
import { getTripsController } from "../Controllers/getTripsController.js";
import upload from "../middleware/upload.js";
import { getTripByIdController } from "../Controllers/getTripByIdController.js";
import { checkoutController } from "../Controllers/checkoutController.js";

const router = express.Router();

router.get("/recent-deliveries", getRecentDeliveries);
router.post("/trips", upload.single("vehicleImage"), saveTripController);
router.get("/trips", getTripsController);
router.get("/trips/:id", getTripByIdController);
router.post("/checkout", checkoutController);

export default router;
