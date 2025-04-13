import Checkout from "../Models/Checkout.js";
export const fetchCheckoutsByTripId = async(req, res) => {
    const { tripId } = req.params;
    try {
        const trips = await Checkout.find({ tripId });
    
        res.status(200).json(trips);
      } catch (error) {
        res.status(500).json({ message: "Error fetching trips", error });
      }
}