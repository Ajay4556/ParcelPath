import express from "express";
import { getRecentDeliveries } from "../Controllers/DeliveryController.js";

const router = express.Router();

router.get("/recent-deliveries", getRecentDeliveries);

export default router;
