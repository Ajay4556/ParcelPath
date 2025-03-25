import React, { useState, useEffect } from "react";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { useNavigate } from "react-router";
import { getUserData } from "../components/LoginHandler";

const ProviderDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const user = await getUserData(); // Assuming this function fetches the user
        if (user && user.id) {
          setUserData(user);
      const response = await fetch(`http://localhost:5000/delivery/trips/user/${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }
      const data = await response.json();
      setTrips(data);
    }
  }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/delivery/deleteTrip/${id}`,
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
        `http://localhost:5000/delivery/updateTrip/${updatedTrip._id}`,
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

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar isWhite={true} />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto p-8">
          <div className="bg-gray-800 h-40 mb-8"></div>
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <img
                src={userData?.profileImage || "https://www.gravatar.com/avatar/?d=mp"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white -mt-12"
              />
              <span className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
                <img src="camera-icon.png" alt="Edit" className="w-6 h-6" />
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-4">Welcome {userData.fullName}</h2>
            <p className="text-gray-600">Welcome back to Parcelpath!</p>
            <button onClick={(e) => navigate('/posttrip')} className="bg-orange-500 text-white px-4 py-2 rounded mt-4">
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleUpdate(trip);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
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