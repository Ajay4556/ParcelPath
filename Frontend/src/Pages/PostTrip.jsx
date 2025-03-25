import React, { useEffect, useState } from "react";
import { FaSearch, FaCalendarAlt, FaClock } from "react-icons/fa";
import { Navbar } from "../Shared/Navbar"; // Adjust if your path differs
import { Footer } from "../Shared/Footer"; // Adjust if your path differs
import { getUserData } from "../components/LoginHandler";

const PostTrip = () => {
  const today = new Date().toISOString().split("T")[0];
  const [userData, setUserData] = useState({});

  const [formData, setFormData] = useState({
    userId: "",
    pickupLocation: "",
    dropoffLocation: "",
    stops: "",
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    serviceProvider: "",
    weightCapacity: "",
    price: "",
    description: "",
    deliveryType: "normal",
  });

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await getUserData(); // Assuming this function fetches the user
          if (user && user.id) {
            setUserData(user);
            setFormData((prevFormData) => ({
              ...prevFormData,
              userId: user.id, // Or user._id if that's the field name
            }));
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();
  }, []);

  // Track vehicle image as a File separately
  const [vehicleImage, setVehicleImage] = useState(null);

  const [errors, setErrors] = useState({});

  // For changing placeholders to date/time inputs on focus
  const [inputTypes, setInputTypes] = useState({
    pickupDate: "text",
    pickupTime: "text",
    dropoffDate: "text",
    dropoffTime: "text",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setVehicleImage(e.target.files[0]);
    }
  };

  const handleFocus = (field) => {
    if (field === "pickupTime" || field === "dropoffTime") {
      setInputTypes((prev) => ({ ...prev, [field]: "time" }));
    } else {
      setInputTypes((prev) => ({ ...prev, [field]: "date" }));
    }
  };

  const handleBlur = (field) => {
    setInputTypes((prev) => ({ ...prev, [field]: "text" }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Construct a FormData object to send both text fields and image
    const data = new FormData();

    // Prepare dropoff locations array
    const dropoffLocations = formData.stops
      ? [
          ...formData.stops.split(",").map((stop) => stop.trim()),
          formData.dropoffLocation,
        ]
      : [formData.dropoffLocation];

    // Append text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "stops" && key !== "dropoffLocation") {
        data.append(key, formData[key]);
      }
    });

    // Append dropoff locations as an array
    dropoffLocations.forEach((location, index) => {
      data.append(`dropoffLocations[${index}]`, location);
    });

    // Append the file
    if (vehicleImage) {
      data.append("vehicleImage", vehicleImage);
    }

    console.log(data);
    

    try {
      const response = await fetch("http://localhost:5000/delivery/trips", {
        method: "POST",
        body: data, // fetch automatically sets the Content-Type for FormData
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessages = {};
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err) => {
            if (err.includes("Pickup location")) {
              errorMessages.pickupLocation = err;
            } else if (err.includes("At least one")) {
              errorMessages.dropoffLocation = err;
            } else if (err.includes("Pickup date")) {
              errorMessages.pickupDate = err;
            } else if (err.includes("Pickup time")) {
              errorMessages.pickupTime = err;
            } else if (err.includes("Drop off date")) {
              errorMessages.dropoffDate = err;
            } else if (err.includes("Drop off time")) {
              errorMessages.dropoffTime = err;
            } else if (err.includes("Price per 100gm")) {
              errorMessages.price = err;
            } else if (err.includes("Trip description")) {
              errorMessages.description = err;
            } else if (err.includes("Weight capacity")) {
              errorMessages.weightCapacity = err;
            } else if (err.includes("Service Provider")) {
              errorMessages.serviceProvider = err;
            } else if (err.includes("Vehicle Image")) {
              errorMessages.vehicleImage = err;
            } else if (err.includes("Delivery type")) {
              errorMessages.deliveryType = err;
            }
          });
        }
        setErrors(errorMessages);
      } else {
        alert("Trip posted successfully!");
        setFormData({
          pickupLocation: "",
          dropoffLocation: "",
          stops: "",
          pickupDate: "",
          pickupTime: "",
          dropoffDate: "",
          dropoffTime: "",
          serviceProvider: "",
          weightCapacity: "",
          price: "",
          description: "",
          deliveryType: "normal",
        });
        setVehicleImage(null);
        setErrors({});
      }
    } catch (error) {
      console.error("Error posting trip:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-8 pt-24">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Post Trip
          <div className="border-b-4 border-orange-500 w-20 mx-auto mt-2"></div>
        </h1>
        <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto">
          {/* Pickup + Dropoff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="pickupLocation"
                placeholder="Pick up city"
                className="w-full border border-red-300 p-2 pl-10 rounded"
                value={formData.pickupLocation}
                onChange={handleInputChange}
              />
              {errors.pickupLocation && (
                <p className="text-red-500 text-sm">{errors.pickupLocation}</p>
              )}
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="dropoffLocation"
                placeholder="Drop Off city"
                className="w-full border border-red-300 p-2 pl-10 rounded"
                value={formData.dropoffLocation}
                onChange={handleInputChange}
              />
              {errors.dropoffLocation && (
                <p className="text-red-500 text-sm">{errors.dropoffLocation}</p>
              )}
            </div>
          </div>

          {/* Stops */}
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="stops"
                placeholder="Add stops (comma separated)"
                className="w-full border border-red-300 p-2 pl-10 rounded"
                value={formData.stops}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Pickup Date + Pickup Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                placeholder="Choose a pickup date"
                type={inputTypes.pickupDate}
                name="pickupDate"
                min={today}
                onFocus={() => handleFocus("pickupDate")}
                onBlur={() => handleBlur("pickupDate")}
                className="w-full border border-red-300 p-2 pl-10 rounded"
                value={formData.pickupDate}
                onChange={handleInputChange}
              />
              {errors.pickupDate && (
                <p className="text-red-500 text-sm">{errors.pickupDate}</p>
              )}
            </div>
            <div className="relative">
              <FaClock className="absolute left-3 top-3 text-gray-400" />
              <input
                placeholder="Choose a pickup time"
                type={inputTypes.pickupTime}
                name="pickupTime"
                onFocus={() => handleFocus("pickupTime")}
                onBlur={() => handleBlur("pickupTime")}
                className="w-full border border-red-300 p-2 pl-10 rounded"
                value={formData.pickupTime}
                onChange={handleInputChange}
              />
              {errors.pickupTime && (
                <p className="text-red-500 text-sm">{errors.pickupTime}</p>
              )}
            </div>
          </div>

          {/* Dropoff Date + Dropoff Time + Service Provider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                placeholder="Drop Off Date"
                type={inputTypes.dropoffDate}
                name="dropoffDate"
                disabled={!formData.pickupDate}
                min={formData.pickupDate || today}
                onFocus={() => handleFocus("dropoffDate")}
                onBlur={() => handleBlur("dropoffDate")}
                className="w-full border border-red-300 p-2 pl-10 rounded"
                value={formData.dropoffDate}
                onChange={handleInputChange}
              />
              {errors.dropoffDate && (
                <p className="text-red-500 text-sm">{errors.dropoffDate}</p>
              )}
            </div>
            <div className="relative">
              <FaClock className="absolute left-3 top-3 text-gray-400" />
              <input
                placeholder="Drop Off Time"
                type={inputTypes.dropoffTime}
                name="dropoffTime"
                onFocus={() => handleFocus("dropoffTime")}
                onBlur={() => handleBlur("dropoffTime")}
                className="w-full border border-red-300 p-2 pl-10 rounded"
                value={formData.dropoffTime}
                onChange={handleInputChange}
              />
              {errors.dropoffTime && (
                <p className="text-red-500 text-sm">{errors.dropoffTime}</p>
              )}
            </div>
            <div className="relative">
              <input
                placeholder="Enter service provider name"
                type="text"
                name="serviceProvider"
                className="w-full border border-red-300 p-2 rounded"
                value={formData.serviceProvider}
                onChange={handleInputChange}
              />
              {errors.serviceProvider && (
                <p className="text-red-500 text-sm">{errors.serviceProvider}</p>
              )}
            </div>
          </div>

          {/* Vehicle Image + Weight Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="font-bold mb-2 block">Add Vehicle Image</label>
              <div className="border border-dashed border-gray-300 p-4 rounded flex justify-center items-center mb-4">
                <input
                  type="file"
                  name="vehicleImage"
                  onChange={handleFileChange}
                />
              </div>
              {errors.vehicleImage && (
                <p className="text-red-500 text-sm">{errors.vehicleImage}</p>
              )}
            </div>

            <div>
              <label className="font-bold mb-2 block">
                Weight capacity for this trip
              </label>
              <input
                type="text"
                name="weightCapacity"
                placeholder="Enter weight in Kgs"
                className="w-full border border-red-300 p-2 rounded"
                value={formData.weightCapacity}
                onChange={handleInputChange}
              />
              {errors.weightCapacity && (
                <p className="text-red-500 text-sm">{errors.weightCapacity}</p>
              )}
            </div>
          </div>

          {/* Price & Description */}
          <div className="mb-4">
            <label className="font-bold mb-2 block">Price per 100gm</label>
            <input
              type="text"
              name="price"
              placeholder="$"
              className="w-full border border-red-300 p-2 rounded"
              value={formData.price}
              onChange={handleInputChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
            <small className="text-gray-500">
              Enter a fair price to cover your expenses.
            </small>
          </div>

          <div className="mb-4">
            <label className="font-bold mb-2 block">Trip description</label>
            <textarea
              name="description"
              placeholder="Add details relevant to your trip."
              className="w-full border border-red-300 p-2 rounded h-24"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Delivery Type */}
          <div className="mb-4">
            <label className="font-bold mb-2 block">Delivery Type</label>
            <select
              name="deliveryType"
              className="w-full border border-red-300 p-2 rounded"
              value={formData.deliveryType}
              onChange={handleInputChange}
            >
              <option value="normal">Normal</option>
              <option value="special">Special</option>
            </select>
            {errors.deliveryType && (
              <p className="text-red-500 text-sm">{errors.deliveryType}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Post Trip
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default PostTrip;
