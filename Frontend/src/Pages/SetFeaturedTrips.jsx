import React, { useState, useEffect } from "react";
import { Navbar } from "../Shared/Navbar";
import { Footer } from "../Shared/Footer";
import { Helmet } from "react-helmet";

const SetFeaturedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch("http://localhost:5000/delivery/trips");
      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeature = async (id) => {
    if (trips.filter((trip) => trip.isFeatured).length >= 3) {
      alert("Only 3 trips can be featured at a time.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/delivery/trips/${id}/feature`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to feature trip");
      }
      setTrips(
        trips.map((trip) =>
          trip._id === id ? { ...trip, isFeatured: true } : trip
        )
      );
    } catch (error) {
      alert("Error featuring trip: " + error.message);
    }
  };

  const handleUnfeature = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delivery/trips/${id}/unfeature`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to unfeature trip");
      }
      setTrips(
        trips.map((trip) =>
          trip._id === id ? { ...trip, isFeatured: false } : trip
        )
      );
    } catch (error) {
      alert("Error unfeaturing trip: " + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Helmet>
        <title>Set Featured Trips - ParcelPath</title>
        <meta
          name="description"
          content="Manage and set featured delivery trips on ParcelPath. Highlight up to three trips to showcase on the platform."
        />
        <meta
          name="keywords"
          content="ParcelPath, set featured trips, manage trips, delivery service, courier service, highlight trips"
        />
        <meta property="og:title" content="Set Featured Trips - ParcelPath" />
        <meta
          property="og:description"
          content="Manage and set featured delivery trips on ParcelPath. Highlight up to three trips to showcase on the platform."
        />
        <meta property="og:image" content="url-to-your-image" />
        <meta
          property="og:url"
          content="http://yourwebsite.com/set-featured-trips"
        />
      </Helmet>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <main className="flex-grow container mx-auto p-8">
          <section className="max-w-2xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Recent Trips
            </h2>
            <div className="bg-white shadow rounded">
              {trips.map((trip) => (
                <div
                  key={trip._id}
                  className="flex items-center justify-between p-4 border-b last:border-b-0"
                >
                  <img
                    src={trip.image || "profile.jpg"}
                    alt="Trip"
                    className="w-12 h-12 rounded-full mr-4"
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
                  {trip.isFeatured ? (
                    <button
                      onClick={() => handleUnfeature(trip._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFeature(trip._id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      ✔️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default SetFeaturedTrips;
