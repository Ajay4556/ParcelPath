import React, { useState, useEffect } from "react";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { useNavigate, useParams } from "react-router";
import { Helmet } from "react-helmet";

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
          `${process.env.REACT_APP_BASEURL}/delivery/trips/${id}`
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
      <Helmet>
        <title>Trip Details - ParcelPath</title>
        <meta
          name="description"
          content="Explore detailed information about your selected delivery trip on ParcelPath. View trip dates, locations, pricing, and more."
        />
        <meta
          name="keywords"
          content="ParcelPath, trip details, delivery service, courier service, trip information, book trip"
        />
        <meta property="og:title" content="Trip Details - ParcelPath" />
        <meta
          property="og:description"
          content="Explore detailed information about your selected delivery trip on ParcelPath. View trip dates, locations, pricing, and more."
        />
        <meta property="og:image" content="url-to-your-image" />
        <meta property="og:url" content="http://yourwebsite.com/trip-detail" />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-8 pt-24">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Trip Detail
          <div className="border-b-4 border-orange-500 w-20 mx-auto mt-2"></div>
        </h1>
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          {/* Image Section */}
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

          {/* Trip Details Section */}
          <div className="p-6 md:p-8 lg:p-10 space-y-6 text-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
                {trip.serviceProvider}
              </h2>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">
                {trip.pickupLocation} to {trip.dropoffLocations.join(", ")}
              </h2>
              <p className="text-gray-600">
                <span className="mr-1" role="img" aria-label="location">
                  📍
                </span>
                {trip.pickupLocation} → {trip.dropoffLocations.join(" → ")}
              </p>
            </div>

            {/* Date and Time Section */}
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

            {/* Price and Vehicle Details */}
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

            {/* Trip Description Section */}
            <div className="flex flex-col items-center">
              <p className="font-medium text-gray-800 mb-2 text-center">
                Trip Description:
              </p>
              <div className="text-gray-700 text-left -mr-4 leading-relaxed whitespace-pre-line w-full max-w-2xl mx-auto">
                {trip.description
                  .split(".")
                  .filter((sentence) => sentence.trim() !== "")
                  .map((sentence, index) => (
                    <span key={index} className="block mb-3">
                      {sentence.trim()}.
                    </span>
                  ))}
              </div>
            </div>

            {/* Book Trip Button */}
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
