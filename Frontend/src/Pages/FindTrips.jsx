import React, { useState, useEffect } from "react";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { Link } from "react-router";
import { Helmet } from "react-helmet";

const FindTrip = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    pickupCity: "",
    destinationCity: "",
    sortBy: "priceLowToHigh",
  });

  useEffect(() => {
    const disableExpiredTrips = async () => {
      try {
        await fetch(`${process.env.REACT_APP_BASEURL}/delivery/disableExpiredTrips`, {
          method: "GET",
        });
      } catch (error) {
        console.error("Error disabling expired trips:", error);
      }
    };

    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASEURL}/delivery/trips`);
        const data = await response.json();
        setTrips(data);
        applyFilters(data); // Apply filters immediately after fetching
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    // First, disable expired trips
    disableExpiredTrips().then(() => {
      // Then, fetch the trips
      fetchTrips();
    });
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
    applyFilters(trips, value);
  };

  const applyFilters = (
    tripsToFilter = trips,
    sortBy = filterCriteria.sortBy
  ) => {
    let filtered = [...tripsToFilter];

    if (filterCriteria.pickupCity || filterCriteria.destinationCity) {
      filtered = filtered.filter((trip) => {
        const allLocations = [trip.pickupLocation, ...trip.dropoffLocations];
        const pickupIndex = allLocations.findIndex(
          (loc) => loc.toLowerCase() === filterCriteria.pickupCity.toLowerCase()
        );
        const destinationIndex = allLocations.findIndex(
          (loc) =>
            loc.toLowerCase() === filterCriteria.destinationCity.toLowerCase()
        );
        return (
          pickupIndex !== -1 &&
          destinationIndex !== -1 &&
          pickupIndex < destinationIndex
        );
      });
    }

    if (sortBy === "showSpecialTrips") {
      filtered = filtered.filter((trip) => trip.deliveryType === "special");
    } else if (sortBy === "priceLowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "earliestFinishDate") {
      filtered.sort(
        (a, b) => new Date(a.dropoffDate) - new Date(b.dropoffDate)
      );
    }

    setFilteredTrips(filtered);
  };

  return (
    <>
      <Helmet>
        <title>Find a Trip - ParcelPath</title>
        <meta
          name="description"
          content="Discover and book delivery trips with ParcelPath. Find reliable delivery providers for your parcel transport needs."
        />
        <meta
          name="keywords"
          content="ParcelPath, find a trip, courier service, delivery providers, parcel transport, book trip"
        />
        <meta
          property="og:title"
          content="Find a Trip - ParcelPath Courier Service"
        />
        <meta
          property="og:description"
          content="Discover and book delivery trips with ParcelPath. Find reliable delivery providers for your parcel transport needs."
        />
        <meta property="og:image" content="url-to-your-image" />
        <meta property="og:url" content="http://yourwebsite.com/find-trip" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow container mx-auto pt-24 mt-10 p-4 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <h1 className="text-3xl font-bold mb-4 md:mb-0 md:mr-4">
                Find A Trip{" "}
                <span className="border-b-4 border-orange-500"></span>
              </h1>
              <div className="flex flex-wrap items-center">
                <input
                  type="text"
                  name="pickupCity"
                  placeholder="Enter Pick up city name"
                  className="border border-red-300 p-2 text-sm rounded mr-4 mb-2"
                  value={filterCriteria.pickupCity}
                  onChange={handleFilterChange}
                />
                <input
                  type="text"
                  name="destinationCity"
                  placeholder="Enter Destination city name"
                  className="border border-red-300 p-2 w-48 text-sm rounded mr-4 mb-2"
                  value={filterCriteria.destinationCity}
                  onChange={handleFilterChange}
                />
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded mb-2"
                  onClick={() => applyFilters()}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <label className="font-bold" htmlFor="sortBy">
                Sort By:{" "}
              </label>
              <select
                name="sortBy"
                value={filterCriteria.sortBy}
                onChange={handleFilterChange}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="priceLowToHigh">Price (Low to High)</option>
                <option value="earliestFinishDate">Earliest Finish Date</option>
                <option value="showSpecialTrips">Show Special Trips</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white shadow rounded overflow-hidden p-4 relative"
              >
                <div className="relative w-full h-48">
                  <img
                    src={trip.image ? trip.image : "placeholder.jpg"}
                    className="w-full h-full object-cover"
                    alt="Trip"
                  />
                  {!trip.image && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white">No Image Available</span>
                    </div>
                  )}
                  {trip.deliveryType === "special" && (
                    <div className="absolute top-0 right-0 bg-gold text-white p-1 rounded-bl">
                      ⭐
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">
                    {trip.serviceProvider}
                  </h2>
                  <h2 className="text-xl font-bold mb-2">
                    {trip.pickupLocation} to {trip.dropoffLocations.join(", ")}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    <span role="img" aria-label="calendar">
                      📅
                    </span>{" "}
                    {new Date(trip.pickupDate).toLocaleDateString()} -{" "}
                    {new Date(trip.dropoffDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span role="img" aria-label="clock">
                      ⏰
                    </span>{" "}
                    {trip.pickupTime} - {trip.dropoffTime}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span role="img" aria-label="money">
                      💰
                    </span>{" "}
                    ${trip.price} per 100gm
                  </p>
                  <div className="text-center">
                    <Link
                      to={`/details/${trip._id}`}
                      className="bg-black text-white px-4 py-2 rounded"
                    >
                      Book Trip
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FindTrip;
