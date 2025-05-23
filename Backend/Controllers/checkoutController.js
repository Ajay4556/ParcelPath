import Checkout from "../Models/Checkout.js";



export const checkoutController = async (req, res) => {

  console.log("Received checkout data:", req.body);

  try {
    const { tripId, userId, weight, calculatedPrice, shippingAddress, pickupAddress } = req.body;

    // Create a new checkout document
    const checkout = new Checkout({
      userId,
      tripId,
      weight,
      calculatedPrice,
      shippingAddress,
      pickupAddress
    });

    // Save the checkout document to the database
    await checkout.save();

    res.status(201).json({ message: 'Checkout data saved successfully.', checkout });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Extract validation error messages
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ errors });
    } else {
      res.status(500).json({ error: 'An error occurred while processing the checkout.' });
    }
  }
};