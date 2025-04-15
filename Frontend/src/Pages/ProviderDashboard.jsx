import React, { useState, useEffect } from "react";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { useNavigate } from "react-router";
import { getUserData } from "../components/LoginHandler";
import { Helmet } from 'react-helmet';

const AddressModal = ({ addresses, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Pickup and Drop-off Addresses
        </h2>
        {addresses && addresses.length > 0 ? (
          addresses.map((address, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="font-semibold mb-2">
                {index % 2 === 0 ? "Pickup Address" : "Drop-off Address"}
              </h3>
              <p className="font-bold">{`${address.firstName} ${address.lastName}`}</p>
              <p>{address.streetAddress}</p>
              {address.aptNumber && <p>{address.aptNumber}</p>}
              <p>{`${address.state}, ${address.zip}`}</p>
            </div>
          ))
        ) : (
          <div className="mb-4 pb-4 border-b last:border-b-0">
            <h3 className="font-semibold mb-2">
              No Checkouts Till Now! Check Again Later!
            </h3>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ProviderDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [userData, setUserData] = useState({});
  const [selectedTripAddresses, setSelectedTripAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTripAddresses = async (tripId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL}/delivery/checkouts/${tripId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trip addresses");
      }
      const data = await response.json();

      // Collect all pickup and drop-off addresses
      const addresses = data.flatMap((checkout) => [
        checkout.pickupAddress,
        checkout.shippingAddress,
      ]);

      setSelectedTripAddresses(addresses);
      setShowAddressModal(true);
    } catch (error) {
      console.error("Error fetching trip addresses:", error);
      alert("Failed to fetch addresses: " + error.message);
    }
  };

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const user = await getUserData(); // Assuming this function fetches the user
        if (user && user.id) {
          setUserData(user);
          const response = await fetch(
            `${process.env.REACT_APP_BASEURL}/delivery/trips/user/${user.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch trips");
          }
          const data = await response.json();
          setTrips(data);
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL}/delivery/deleteTrip/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete trip");
        }
        setTrips(trips.filter((trip) => trip._id !== id));
        alert("Trip deleted successfully!");
      } catch (error) {
        alert("Error deleting trip: " + error.message);
      }
    }
  };

  const handleUpdate = (trip) => {
    setCurrentTrip(trip);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedTrip) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL}/delivery/updateTrip/${updatedTrip._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTrip),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update trip");
      }
      const data = await response.json();
      setTrips(
        trips.map((trip) => (trip._id === data.trip._id ? data.trip : trip))
      );
      setShowUpdateModal(false);
      alert("Trip updated successfully!");
    } catch (error) {
      alert("Error updating trip: " + error.message);
    }
  };

  // Calculate average rating
  const averageRating =
    userData.reviews && userData.reviews.length > 0
      ? userData.reviews.reduce((acc, rating) => acc + rating, 0) /
        userData.reviews.length
      : 0;

  // Render stars based on average rating
  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="text-yellow-500">
            ★
          </span>
        ))}
        {halfStar === 1 && <span className="text-yellow-500">☆</span>}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="text-gray-300">
            ★
          </span>
        ))}
      </>
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Helmet>
        <title>Provider Dashboard - ParcelPath</title>
        <meta
          name="description"
          content="Manage your delivery trips with ParcelPath. View, update, and delete trips, and check pickup and drop-off addresses."
        />
        <meta
          name="keywords"
          content="ParcelPath, provider dashboard, manage trips, delivery service, courier service, trip management"
        />
        <meta property="og:title" content="Provider Dashboard - ParcelPath" />
        <meta
          property="og:description"
          content="Manage your delivery trips with ParcelPath. View, update, and delete trips, and check pickup and drop-off addresses."
        />
        <meta property="og:image" content="url-to-your-image" />
        <meta
          property="og:url"
          content="http://yourwebsite.com/provider-dashboard"
        />
      </Helmet>
      <Navbar isWhite={true} />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto p-8">
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
              <span className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
                <img src="camera-icon.png" alt="Edit" className="w-6 h-6" />
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-4">
              Welcome {userData.fullName}
            </h2>
            <p className="text-gray-600">Welcome back to Parcelpath!</p>
            <div className="flex justify-center mt-2">{renderStars()}</div>
            <button
              onClick={(e) => navigate("/posttrip")}
              className="bg-orange-500 text-white px-4 py-2 rounded mt-4"
            >
              Post Trip
            </button>
          </div>

          <section>
            <h2 className="text-xl font-bold mb-4">Your Trips</h2>
            <div className="bg-white shadow rounded">
              {trips.map((trip) => (
                <div
                  key={trip._id}
                  onClick={() => navigate(`/details/${trip._id}`)}
                  className="flex items-center p-4 border-b last:border-b-0"
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
                  {/* New button to view addresses */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchTripAddresses(trip._id);
                    }}
                    className="text-green-500 hover:text-green-700 mr-4"
                  >
                    View Addresses
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(trip);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(trip._id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Address Modal */}
          {showAddressModal && (
            <AddressModal
              addresses={selectedTripAddresses}
              onClose={() => setShowAddressModal(false)}
            />
          )}
        </main>
        <Footer />

        {showUpdateModal && (
          <UpdateModal
            trip={currentTrip}
            onClose={() => setShowUpdateModal(false)}
            onSubmit={handleUpdateSubmit}
          />
        )}
      </div>
    </>
  );
};

const UpdateModal = ({ trip, onClose, onSubmit }) => {
  const formatDateForInput = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    ...trip,
    pickupDate: formatDateForInput(trip.pickupDate),
    dropoffDate: formatDateForInput(trip.dropoffDate),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Update Trip</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Service Provider</label>
            <input
              type="text"
              name="serviceProvider"
              value={formData.serviceProvider}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Pickup Date</label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Dropoff Date</label>
            <input
              type="date"
              name="dropoffDate"
              value={formData.dropoffDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Pickup Time</label>
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Dropoff Time</label>
            <input
              type="time"
              name="dropoffTime"
              value={formData.dropoffTime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Weight Capacity</label>
            <input
              type="number"
              name="weightCapacity"
              value={formData.weightCapacity}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Delivery Type</label>
            <select
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="normal">Normal</option>
              <option value="special">Special</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-black mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderDashboard;
