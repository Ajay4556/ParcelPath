import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/AuthRoutes.js";
import deliveryRoutes from "./Routes/DeliveryRoute.js";
import adminRoutes from "./Routes/adminRoutes.js"
import connectDB from "./Config/database.js";
import cors from "cors";
dotenv.config();


const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://parcel-path.netlify.app',
  'https://social-phones-lose.loca.lt',
  'https://twelve-spies-fold.loca.lt'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // if using cookies or auth headers
}));
app.use(express.json());

// connect to the database
connectDB();

app.use("/auth", authRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
