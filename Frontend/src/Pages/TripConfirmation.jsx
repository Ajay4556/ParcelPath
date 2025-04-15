import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { Link } from "react-router"; // Corrected import for Link
import { Helmet } from "react-helmet";

const TripConfirmation = () => {
  const location = useLocation();
  const { checkout } = location.state.checkoutData || {};
  const [daysUntilDropoff, setDaysUntilDropoff] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL}/delivery/trips/${checkout.tripId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trip details");
        }
        const data = await response.json();

        // Calculate the number of days until dropoff
        const dropoffDate = new Date(data.dropoffDate);
        const today = new Date();
        const timeDiff = dropoffDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setDaysUntilDropoff(daysDiff);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (checkout && checkout.tripId) {
      fetchTrip();
    }
  }, [checkout]);

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-gray-50">
      <Helmet>
        <title>Trip Confirmation - Parcelpath</title>
      </Helmet>
      <Navbar />

      <main className="flex-grow container mx-auto px-4 md:px-8 pt-24">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-8 text-center border border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Booking Confirmed!
          </h1>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Your trip has been successfully booked. Check your email for more
            details related to your trip.
          </p>
          <div className="mb-6">
            <img
              src="Assets/Images/confirmed.png"
              alt="Confirmation Illustration"
              className="mx-auto h-32 md:h-40"
            />
          </div>

          {/* Display Days Until Dropoff */}
          {daysUntilDropoff !== null && (
            <p className="text-lg font-bold mb-4">
              Your parcel will be delivered in {daysUntilDropoff} days.
            </p>
          )}

          {/* Display Order Details */}
          {checkout && (
            <div className="text-left mb-8">
              <h2 className="text-lg font-bold mb-2">Order Details</h2>
              <p><strong>Order ID:</strong> {checkout._id}</p>
              <p><strong>Weight:</strong> {checkout.weight} grams</p>
              <p><strong>Total Price:</strong> ${checkout.calculatedPrice.toFixed(2)}</p>
              <p><strong>Shipping Name:</strong> {checkout.shippingAddress.firstName} {checkout.shippingAddress.lastName}</p>
              <p><strong>Shipping Address:</strong> {checkout.shippingAddress.streetAddress}, Apt {checkout.shippingAddress.aptNumber}, {checkout.shippingAddress.state}, {checkout.shippingAddress.zip}</p>
              <p><strong>Pickup Name:</strong> {checkout.pickupAddress.firstName} {checkout.pickupAddress.lastName}</p>
              <p><strong>Pickup Address:</strong> {checkout.pickupAddress.streetAddress}, Apt {checkout.pickupAddress.aptNumber}, {checkout.pickupAddress.state}, {checkout.pickupAddress.zip}</p>
              <p><strong>Order Date:</strong> {new Date(checkout.createdAt).toLocaleDateString()}</p>
            </div>
          )}

          <p className="text-gray-600 mb-8">
            If you have any questions, feel free to reach out to our support
            team. We wish you a pleasant trip!
          </p>
          <div>
            <Link to="/dashboard">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 md:px-6 py-2 md:py-3 rounded-md shadow-lg">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TripConfirmation;