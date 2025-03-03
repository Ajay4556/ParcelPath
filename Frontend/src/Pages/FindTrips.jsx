import React, { useState, useEffect } from "react";
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { Link } from "react-router";

const FindTrip = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    pickupCity: "",
    destinationCity: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:5000/delivery/trips");
        const data = await response.json();
        setTrips(data);
        setFilteredTrips(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = trips;

    if (filterCriteria.pickupCity) {
      filtered = filtered.filter((trip) =>
        trip.pickupLocation
          .toLowerCase()
          .includes(filterCriteria.pickupCity.toLowerCase())
      );
    }

    if (filterCriteria.destinationCity) {
      filtered = filtered.filter((trip) =>
        trip.dropoffLocation
          .toLowerCase()
          .includes(filterCriteria.destinationCity.toLowerCase())
      );
    }

    if (filterCriteria.minPrice) {
      filtered = filtered.filter(
        (trip) => trip.price >= parseFloat(filterCriteria.minPrice)
      );
    }

    if (filterCriteria.maxPrice) {
      filtered = filtered.filter(
        (trip) => trip.price <= parseFloat(filterCriteria.maxPrice)
      );
    }

    if (filterCriteria.startDate) {
      filtered = filtered.filter(
        (trip) =>
          new Date(trip.pickupDate) >= new Date(filterCriteria.startDate)
      );
    }

    if (filterCriteria.endDate) {
      filtered = filtered.filter(
        (trip) => new Date(trip.dropoffDate) <= new Date(filterCriteria.endDate)
      );
    }

    setFilteredTrips(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto pt-24 mt-10 p-4 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          {/* Search Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <h1 className="text-3xl font-bold mb-4 md:mb-0 md:mr-4">
              Find A Trip <span className="border-b-4 border-orange-500"></span>
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
                onClick={applyFilters}
              >
                Search
              </button>
            </div>
          </div>

          {/* Filter Button */}
          <div className="mt-4 md:mt-0">
            <button
              className="text-gray-600 hover:text-black text-xl"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Close Filters" : "Filter trips by date and price"}
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {/* {showFilters && (
          <div className="mb-8 p-4 border border-gray-300 rounded">
            <div className="flex flex-wrap items-center">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                className="border border-gray-300 p-2 text-sm rounded mr-4 mb-2"
                value={filterCriteria.minPrice}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                className="border border-gray-300 p-2 text-sm rounded mr-4 mb-2"
                value={filterCriteria.maxPrice}
                onChange={handleFilterChange}
              />
              <input
                type="date"
                name="startDate"
                className="border border-gray-300 p-2 text-sm rounded mr-4 mb-2"
                value={filterCriteria.startDate}
                onChange={handleFilterChange}
              />
              <input
                type="date"
                name="endDate"
                className="border border-gray-300 p-2 text-sm rounded mr-4 mb-2"
                value={filterCriteria.endDate}
                onChange={handleFilterChange}
              />
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded mb-2"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )} */}

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white shadow rounded overflow-hidden p-4"
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
              </div>

              {/* Trip Details */}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">
                  {trip.serviceProvider}
                </h2>
                <h2 className="text-xl font-bold mb-2">
                  {trip.pickupLocation} to {trip.dropoffLocation}
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
  );
};

export default FindTrip;
