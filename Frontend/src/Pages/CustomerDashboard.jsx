import React, { useState, useEffect } from "react";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { api } from "../API/api";
import { getUserData } from "../components/LoginHandler";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";

const CustomerDashboard = () => {
  const [currentTrips, setCurrentTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [checkOutData, setCheckOutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await getUserData();
          setUserData(user);
          if (user && Object.keys(user).length > 0) {
            const userId = user.id;
            const response = await api.get(`/delivery/user/${userId}/trips`);
            if (response.data.success) {
              setCurrentTrips(response.data.currentTrips);
              setCompletedTrips(response.data.completedTrips);
              setCheckOutData(response.data.checkOutData);
            }
          }
        } else {
          setError("Failed to fetch trips");
        }
      } catch (err) {
        setError("Error fetching trips");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrips();
  }, []);

  const handleTripClick = (trip) => {
    const checkOutInfo = checkOutData.find(
      (data) => data.tripId._id === trip._id
    );

    setSelectedTrip(trip);
    setSelectedCheckOut(checkOutInfo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTrip(null);
    setSelectedCheckOut(null);
    setSelectedRating(0);
  };

  const handleStarClick = (event, rating) => {
    event.stopPropagation();
    setSelectedRating(rating);
  };

  const submitReview = async (event, providerId, tripId) => {
    event.stopPropagation();
    try {
      const response = await api.post(
        `${process.env.REACT_APP_BASEURL}/auth/submitReview`,
        {
          userId: providerId, // reviewing the provider
          rating: selectedRating,
        }
      );

      if (response.data.status === "success") {
        localStorage.setItem(`tripRating_${tripId}`, selectedRating);
        alert("Review submitted successfully!");
        setSelectedRating(0);
        setSelectedTrip(null);
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Customer Dashboard - ParcelPath</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto p-8 mt-10">
        <div className="bg-gray-800 h-40 mb-8"></div>
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <img
              src={
                userData?.profileImage ||
                "https://www.gravatar.com/avatar/?d=mp"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white -mt-12"
            />
          </div>
          <h2 className="text-2xl font-bold mt-4">
            Welcome {userData?.fullName}
          </h2>
          <p className="text-gray-600">Welcome back to Parcelpath!</p>
          <button
            onClick={() => navigate("/findtrip")}
            className="bg-orange-500 text-white px-4 py-2 rounded mt-4"
          >
            Find Trips
          </button>
        </div>

        {/* Current Trips Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Current Trips</h2>
          <div className="bg-white shadow rounded">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : currentTrips.length > 0 ? (
              currentTrips.map((trip, index) => (
                <div
                  key={index}
                  onClick={() => handleTripClick(trip)}
                  className="flex items-center p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={trip.image || "profile.jpg"}
                    alt="Trip"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <p className="font-bold">
                      {trip.pickupLocation} to{" "}
                      {trip.dropoffLocations.join(", ")}
                    </p>
                    <p className="text-gray-600">
                      {new Date(trip.pickupDate).toLocaleDateString()} at{" "}
                      {trip.pickupTime}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>You don't have any current trips.</p>
            )}
          </div>
        </section>

        {/* Completed Trips Section */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Completed Trips</h2>
          <div className="bg-white shadow rounded">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : completedTrips.length > 0 ? (
              completedTrips.map((trip, index) => {
                const storedRating = localStorage.getItem(
                  `tripRating_${trip._id}`
                );
                const isSelected = selectedTrip?._id === trip._id;

                return (
                  <div
                    key={index}
                    onClick={() => handleTripClick(trip)}
                    className="flex items-center p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      src={trip.image || "profile.jpg"}
                      alt="Trip"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div className="flex-grow">
                      <p className="font-bold">
                        {trip.pickupLocation} to{" "}
                        {trip.dropoffLocations.join(", ")}
                      </p>
                      <p className="text-gray-600">
                        {new Date(trip.pickupDate).toLocaleDateString()} at{" "}
                        {trip.pickupTime}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={(event) => {
                            if (!storedRating) {
                              setSelectedTrip(trip);
                              handleStarClick(event, star);
                            }
                          }}
                          className={`cursor-pointer ${
                            star <=
                            (storedRating || (isSelected ? selectedRating : 0))
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      {!storedRating &&
                        isSelected &&
                        selectedRating > 0 && (
                          <button
                            onClick={(e) =>
                              submitReview(
                                e,
                                trip.userId, // service provider ID
                                trip._id
                              )
                            }
                            className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Submit
                          </button>
                        )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>You don't have any completed trips.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {showModal && (
        <TripDetailsModal
          trip={selectedTrip}
          checkOutInfo={selectedCheckOut}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Modal Component
const TripDetailsModal = ({ trip, checkOutInfo, onClose }) => {
  if (!trip || !checkOutInfo) return null;

  const dropoffDate = new Date(trip.dropoffDate);
  const currentDate = new Date();
  const isDelivered = dropoffDate < currentDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖️
        </button>
        <h2 className="text-xl font-bold mb-4">Trip & Parcel Details</h2>
        <p className="mb-2">
          <strong>Pickup:</strong> {trip.pickupLocation} at {trip.pickupTime} on{" "}
          {new Date(trip.pickupDate).toLocaleDateString()}
        </p>
        <p className="mb-2">
          <strong>Dropoff:</strong> {trip.dropoffLocations.join(", ")} at{" "}
          {trip.dropoffTime} on {dropoffDate.toLocaleDateString()}
        </p>
        <p className="mb-4">
          <strong>Status:</strong>{" "}
          {isDelivered ? (
            <span className="text-green-500">Delivered</span>
          ) : (
            <span className="text-orange-500">
              Expected on {dropoffDate.toLocaleDateString()} at{" "}
              {trip.dropoffTime}
            </span>
          )}
        </p>

        {/* Checkout Info */}
        <h3 className="text-lg font-bold mt-4 mb-2">Checkout Details</h3>
        <p className="mb-2">
          <strong>Shipping Name:</strong>{" "}
          {checkOutInfo.shippingAddress.firstName}{" "}
          {checkOutInfo.shippingAddress.lastName}
        </p>
        <p className="mb-2">
          <strong>Shipping Address:</strong>{" "}
          {checkOutInfo.shippingAddress.streetAddress}, Apt{" "}
          {checkOutInfo.shippingAddress.aptNumber},{" "}
          {checkOutInfo.shippingAddress.state},{" "}
          {checkOutInfo.shippingAddress.zip}
        </p>
        <p className="mb-2">
          <strong>Pickup Name:</strong>{" "}
          {checkOutInfo.pickupAddress.firstName}{" "}
          {checkOutInfo.pickupAddress.lastName}
        </p>
        <p className="mb-2">
          <strong>Pickup Address:</strong>{" "}
          {checkOutInfo.pickupAddress.streetAddress}, Apt{" "}
          {checkOutInfo.pickupAddress.aptNumber},{" "}
          {checkOutInfo.pickupAddress.state}, {checkOutInfo.pickupAddress.zip}
        </p>
        <p className="mb-2">
          <strong>Parcel Weight:</strong> {checkOutInfo.weight} g
        </p>
        <p className="mb-2">
          <strong>Price Paid:</strong> $
          {checkOutInfo.calculatedPrice.toFixed(2)}
        </p>
        <p className="mb-4">
          <strong>Checkout Date:</strong>{" "}
          {new Date(checkOutInfo.createdAt).toLocaleDateString()}
        </p>

        <img
          src={trip.image || "profile.jpg"}
          alt="Parcel"
          className="w-max h-40 object-cover rounded-md mb-4"
        />
        <button
          onClick={onClose}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
