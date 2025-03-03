import React, { useState, useEffect } from "react";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";

const TripDetail = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleBookTrip = () => {
    navigate(`/checkout`, { state: { trip } });
  };

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/delivery/trips/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trip details");
        }
        const data = await response.json();
        setTrip(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-8 pt-24">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Trip Detail
          <div className="border-b-4 border-orange-500 w-20 mx-auto mt-2"></div>
        </h1>
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="relative w-full h-64 bg-gray-100">
            {trip.image ? (
              <img
                src={trip.image}
                alt="Trip"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-lg">No Image Available</span>
              </div>
            )}
          </div>
          <div className="p-6 md:p-8 lg:p-10 space-y-6 text-center">
            <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">{trip.serviceProvider}</h2>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">
                {trip.pickupLocation} to {trip.dropoffLocation}
              </h2>
              <p className="text-gray-600">
                <span className="mr-1" role="img" aria-label="location">
                  📍
                </span>
                {trip.pickupLocation} → {trip.dropoffLocation}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Pick-up Date:</span>{" "}
                  {new Date(trip.pickupDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Pick-up Time:</span>{" "}
                  {trip.pickupTime}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Drop-off Date:</span>{" "}
                  {new Date(trip.dropoffDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Drop-off Time:</span>{" "}
                  {trip.dropoffTime}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8">
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">Price per 100g:</span> $
                  {trip.price}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Total Capacity:</span>{" "}
                  {trip.weightCapacity || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">
                  Vehicle Details:
                </p>
                <p className="text-gray-700">{trip.vehicleDetails || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-800 mb-2">
                Trip Description:
              </p>
              <p className="text-gray-700 leading-relaxed">
                {trip.description}
              </p>
            </div>
            <div>
              <button
                onClick={handleBookTrip}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Book Trip
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TripDetail;
