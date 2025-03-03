import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trip } = location.state || {};
  const [weight, setWeight] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [aptNumber, setAptNumber] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [apiErrors, setApiErrors] = useState(null);
  const [weightError, setWeightError] = useState(null);
  const [errors, setErrors] = useState({});

  const handleWeightChange = (e) => {
    const inputWeight = e.target.value;
    setWeight(inputWeight);

    if (trip && inputWeight) {
      const weightCapacityInGrams = trip.weightCapacity * 1000; // Convert kg to grams
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

  const validateCardDetails = () => {
    if (!nameOnCard || !cardNumber || !expiry || !cvv) {
      alert("Please fill in all card details.");
      return false;
    }
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      alert("Invalid card number.");
      return false;
    }
    if (cvv.length !== 3 || isNaN(cvv)) {
      alert("Invalid CVV.");
      return false;
    }
    return true;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (weightError) {
      alert("Please correct the weight error before proceeding.");
      return;
    }

    const checkoutData = {
      tripId: trip._id,
      weight,
      calculatedPrice,
      firstName,
      lastName,
      streetAddress,
      aptNumber,
      state,
      zip,
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
        const errorMessages = {};
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err) => {
            if (err.includes("Weight")) {
              errorMessages.weight = err;
            } else if (err.includes("First name")) {
              errorMessages.firstName = err;
            } else if (err.includes("Last name")) {
              errorMessages.lastName = err;
            } else if (err.includes("Street address")) {
              errorMessages.address = err;
            } else if (err.includes("State")) {
              errorMessages.state = err;
            } else if (err.includes("ZIP code") || err.includes("postal code")) {
              errorMessages.zip = err;
            }
          });
        }
        setErrors(errorMessages);
      } else {
        setErrors("");
        if (validateCardDetails()) {
          navigate("/confirmation", { state: { checkoutData: data } });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setApiErrors("An error occurred during checkout.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins">
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
            {errors.weight && (
              <p className="text-red-500 mb-4">{errors.weight}</p>
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
            <form onSubmit={handleCheckout}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street Address"
                  className="w-full border border-gray-300 p-2 rounded mb-4"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 mb-4">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    value={aptNumber}
                    onChange={(e) => setAptNumber(e.target.value)}
                    placeholder="Apt Number"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="Zip"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                  )}
                </div>
              </div>

              {/* Payment Method Section */}
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  placeholder="Name on Card"
                  className="border border-gray-300 p-2 rounded"
                />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="Expiry (MM/YY)"
                  className="border border-gray-300 p-2 rounded"
                />
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded text-center"
              >
                Done
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
