import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { getUserData } from "../components/LoginHandler";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Helmet } from "react-helmet";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ trip, userData, weight, calculatedPrice, shippingAddress, pickupAddress, setApiErrors, navigate }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("Stripe error:", error);
      setApiErrors("An error occurred with your card details.");
      return;
    }

    // Proceed with your checkout logic
    const checkoutData = {
      tripId: trip._id,
      userId: userData.id,
      weight,
      calculatedPrice,
      shippingAddress,
      pickupAddress,
      paymentMethodId: paymentMethod.id,
    };

    try {
      const response = await fetch("http://localhost:5000/delivery/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiErrors("An error occurred during checkout.");
      } else {
        // Call the API to update the trip's weight capacity
        const updateResponse = await fetch(`http://localhost:5000/delivery/updateTrip/weight/${trip._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ weight }),
        });

        if (!updateResponse.ok) {
          const updateError = await updateResponse.json();
          console.error("Error updating trip weight:", updateError);
          setApiErrors("An error occurred while updating the trip weight.");
        } else {
          // Redirect to confirmation page
          navigate("/confirmation", { state: { checkoutData: data } });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setApiErrors("An error occurred during checkout.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded text-center" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trip } = location.state || {};
  const [weight, setWeight] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    aptNumber: "",
    state: "",
    zip: ""
  });
  const [pickupAddress, setPickupAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    aptNumber: "",
    state: "",
    zip: ""
  });
  const [apiErrors, setApiErrors] = useState(null);
  const [weightError, setWeightError] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await getUserData();
          setUserData(user);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();
  }, []);

  const handleWeightChange = (e) => {
    const inputWeight = e.target.value;
    setWeight(inputWeight);

    if (trip && inputWeight) {
      const weightCapacityInGrams = trip.weightCapacity * 1000;
      if (inputWeight > weightCapacityInGrams) {
        setWeightError(
          `The maximum allowed weight is ${trip.weightCapacity} kg.`
        );
        setCalculatedPrice(0);
      } else {
        setWeightError(null);
        const pricePer100gm = trip.price;
        const totalPrice = (inputWeight / 100) * pricePer100gm;
        setCalculatedPrice(totalPrice);
      }
    } else {
      setCalculatedPrice(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Helmet>
        <title>Checkout - Parcelpath</title>
      </Helmet>
      <Navbar />

      <main className="flex-grow container mx-auto px-4 md:px-8 pt-24">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          <span className="inline-block">
            Checkout
            <div className="border-b-4 border-orange-500 w-3/4 mx-auto mt-2"></div>
          </span>
        </h1>

        {/* Display API Errors */}
        {apiErrors && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {apiErrors}
          </div>
        )}

        {/* Get Your Price Section */}
        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-bold mb-4">Get Your Price</h2>
          <div className="border border-gray-300 p-6 rounded">
            <input
              type="number"
              value={weight}
              min={100}
              max={500}
              onChange={handleWeightChange}
              placeholder="Enter weight in grams"
              className="w-48 border border-gray-300 p-2 rounded mb-4"
            />
            {weightError && (
              <div className="text-red-500 mb-4">{weightError}</div>
            )}
            <p>
              Your Price: ${calculatedPrice.toFixed(2)} (Price per 100 gms:{" "}
              {trip.price}$)
            </p>
          </div>
        </section>

        {/* Order Summary Section */}
        {calculatedPrice > 0 && (
          <section className="mb-10">
            <h2 className="text-lg md:text-xl font-bold mb-4">Order Summary</h2>
            <div className="bg-gray-200 p-8 rounded text-gray-700 flex flex-col md:flex-row">
              <div className="md:w-1/2 space-y-2">
                <p className="text-lg">Price: ${calculatedPrice.toFixed(2)}</p>
                <p className="text-lg">Packaging and handling: 5.50</p>
                <p className="text-lg">
                  Before tax: ${(calculatedPrice + 5.5).toFixed(2)}
                </p>
                <p className="text-lg">
                  Tax Collected: ${(calculatedPrice * 0.13).toFixed(2)}
                </p>
                <hr className="border-t border-gray-300 my-4" />
                <p className="text-lg">
                  Order Total: $
                  {(calculatedPrice + 5.5 + calculatedPrice * 0.13).toFixed(2)}
                </p>
              </div>
              <div className="md:w-1/2"></div>
            </div>
          </section>
        )}

        {/* Shipping Address Section */}
        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-bold mb-4">
            Shipping Address
          </h2>
          <div className="border border-gray-300 p-6 rounded">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    value={shippingAddress.firstName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                    placeholder="First Name"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={shippingAddress.lastName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                    placeholder="Last Name"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={shippingAddress.streetAddress}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                  placeholder="Street Address"
                  className="w-full border border-gray-300 p-2 rounded mb-4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    value={shippingAddress.aptNumber}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, aptNumber: e.target.value })}
                    placeholder="Apt Number"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="State"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                    placeholder="Zip"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
              </div>

              {/* Pickup Address Section */}
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Pickup Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    value={pickupAddress.firstName}
                    onChange={(e) => setPickupAddress({ ...pickupAddress, firstName: e.target.value })}
                    placeholder="First Name"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={pickupAddress.lastName}
                    onChange={(e) => setPickupAddress({ ...pickupAddress, lastName: e.target.value })}
                    placeholder="Last Name"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={pickupAddress.streetAddress}
                  onChange={(e) => setPickupAddress({ ...pickupAddress, streetAddress: e.target.value })}
                  placeholder="Street Address"
                  className="w-full border border-gray-300 p-2 rounded mb-4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    value={pickupAddress.aptNumber}
                    onChange={(e) => setPickupAddress({ ...pickupAddress, aptNumber: e.target.value })}
                    placeholder="Apt Number"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={pickupAddress.state}
                    onChange={(e) => setPickupAddress({ ...pickupAddress, state: e.target.value })}
                    placeholder="State"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={pickupAddress.zip}
                    onChange={(e) => setPickupAddress({ ...pickupAddress, zip: e.target.value })}
                    placeholder="Zip"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-bold mb-4">
            Payment Method
          </h2>
          <div className="border border-gray-300 p-6 rounded">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                trip={trip}
                userData={userData}
                weight={weight}
                calculatedPrice={calculatedPrice}
                shippingAddress={shippingAddress}
                pickupAddress={pickupAddress}
                setApiErrors={setApiErrors}
                navigate={navigate}
              />
            </Elements>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;