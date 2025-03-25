import React, { useState, useEffect } from "react";
import { Navbar } from "../Shared/Navbar";
import { Footer } from "../Shared/Footer";
import { api } from "../API/api.js";
import { Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router";
import {
  getUserData,
  handleGoogleLoginSession,
} from "../components/LoginHandler.js";

const Dashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        let userData = null;

        // Check for standard login
        try {
          userData = await getUserData();
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching standard login data:", error);
        }

        // If not logged in via standard login, check Google login
        if (!userData) {
          try {
            userData = await handleGoogleLoginSession();
          } catch (error) {
            console.error("Error fetching Google login data:", error);
          }
        }

        if (userData) {
          setIsLoggedIn(true);
          setUserName(userData.fullName || userData.name); // Use fullName or name based on available data
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        setIsLoggedIn(false);
      }
    };

    checkUserStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "http://localhost:5000/auth/google/signout";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getDeliveries = async () => {
    const response = await api.get("/delivery/featured-trips");
    const data = await response.data;
    setDeliveries(data);
  };

  useEffect(() => {
    getDeliveries();
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    if (userData.role === "service provider") {
      navigate("/posttrip");
    } else if (userData.role === "consumer") {
      navigate("/findtrip");
    } else {
      navigate("/admin-dashboard");
    }
  };

  return (
    <>
      <div className="font-sans">
        {/* Hero Section with Navbar */}
        <div
          className="relative min-h-screen bg-cover bg-center text-white flex flex-col"
          style={{ backgroundImage: "url('Assets/Images/image.png')" }}
        >
          <Navbar isWhite={true} />
          <div className="flex flex-grow items-center justify-start px-4 md:px-10">
            <div
              className="max-w-2xl p-4 md:p-8 rounded-md"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <h1
                className="text-3xl sm:text-4xl font-bold leading-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                "Connecting You to Reliable{" "}
                {userData.role === "consumer"
                  ? "Delivery Providers"
                  : "Customers"}{" "}
                for Seamless Parcel Transport"
              </h1>
              <p
                className="mt-4 text-base sm:text-lg"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Flexible, affordable, and convenient delivery solutions tailored
                to your needs.
              </p>
              <button
                onClick={handleClick}
                className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 font-bold"
              >
                {userData.role === "service provider"
                  ? "Post Trip"
                  : userData.role === "consumer"
                  ? "Book Trip"
                  : "See Dashboard"}
              </button>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section
          className="py-16 text-left"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <h2 className="text-2xl font-bold text-center">How It Works</h2>
          <div className="w-16 h-1 bg-orange-500 mt-2 mb-6 mx-auto"></div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
            {[
              {
                id: "01",
                title: "Browse Trips",
                desc: "Find delivery providers traveling to your destination.",
              },
              {
                id: "02",
                title: "Book a Service",
                desc: "Choose a provider, share parcel details, and confirm your booking.",
              },
              {
                id: "03",
                title: "Stay Updated",
                desc: "Track your parcel and enjoy timely deliveries.",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="border-2 border-orange-500 rounded-lg p-6 shadow-sm bg-[#fdfaf6]"
              >
                <span className="text-orange-500 text-3xl font-bold">
                  {item.id}
                </span>
                <h3 className="text-lg font-bold mt-2">{item.title}</h3>
                <p className="text-white-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section
          className="py-16"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <h2 className="text-2xl font-bold text-center">Why Choose Us</h2>
          <div className="w-16 h-1 bg-orange-500 mt-2 mb-6 mx-auto"></div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto px-4">
            {[
              {
                icon: "Assets/Images/wcu_icons/fastandeasy.png",
                title: "Fast and Easy",
                desc: "Simplify your delivery needs in just a few clicks.",
              },
              {
                icon: "Assets/Images/wcu_icons/trustworthy.png",
                title: "Trustworthy",
                desc: "All delivery companies on Shiply are feedback rated for your peace of mind.",
              },
              {
                icon: "Assets/Images/wcu_icons/greatprices.png",
                title: "Great Prices",
                desc: "Compare prices and find budget-friendly delivery services.",
              },
              {
                icon: "Assets/Images/wcu_icons/greatprices.png",
                title: "Helpful",
                desc: "Need assistance? Email or call us. We are here to help.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6"
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-18 h-16 mb-4"
                />
                <h3 className="text-lg font-bold text-left">{item.title}</h3>
                <p className="text-white-600 mt-1 text-left">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Delivery Section */}
        <section
          className="py-16 text-center bg-white-100"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <h2 className="text-2xl font-bold">Featured Delivery</h2>
          <div className="w-16 h-1 bg-orange-500 mt-2 mb-6 mx-auto"></div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {deliveries.map((trip, index) => (
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
        </section>

        {/* Call to Action Section */}
        <section
          className="relative flex flex-col items-center text-center bg-[#fdfaf6] p-10 rounded-2xl shadow-md mx-4 my-10 overflow-hidden"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <img
            src="Assets/Images/abstract/abstract.png"
            alt="Abstract Design"
            className="absolute top-0 left-0 w-20 h-20 md:w-32 md:h-32 rotate-180 hidden sm:block"
          />
          <img
            src="Assets/Images/abstract/abstract.png"
            alt="Abstract Design"
            className="absolute bottom-0 right-0 w-20 h-20 md:w-32 md:h-32 transform hidden sm:block"
          />
          <h2 className="text-2xl font-bold text-white-900">
            "Choose Your Role and Get Started!"
          </h2>
          <div className="w-16 h-1 bg-orange-500 mt-2 mb-4"></div>
          <p className="text-white-700 max-w-2xl mb-6 px-4">
            "Our platform is your one-stop solution for seamless delivery
            connections. Whether you're looking to find a trusted provider for
            your parcel or want to maximize your trip by offering delivery
            services, we've got you covered. Choose your role and start your
            journey today!"
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-orange-600">
              Post Your Delivery Trip
            </button>
            <button className="border border-orange-500 text-orange-500 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-orange-100">
              Find a Delivery Provider
            </button>
          </div>
        </section>

        {/* Testimonials */}
        <section
          className="flex flex-col items-center text-center bg-white mt-10"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <h2 className="text-2xl font-bold text-white-900">Testimonials</h2>
          <div className="w-16 h-1 bg-orange-500 mt-2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
            {[
              {
                text: "This platform made it so easy to find a trustworthy provider. My parcel arrived on time and in perfect condition!",
                name: "Jennifer Anderson",
                image: "/Assets/images/jennifer.png",
              },
              {
                text: "I filled my empty truck space and earned extra money. Highly recommend!",
                name: "Suffy Anderson",
                image: "/Assets/images/suffy.png",
              },
              {
                text: "I shipped my parcel quickly and at an affordable price—fantastic experience!",
                name: "Kim Collison",
                image: "/Assets/images/kim.png",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="border rounded-lg shadow-md bg-[#fdfaf6] flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex justify-start">
                    <img
                      src="/Assets/Images/icons/quotes.png"
                      alt="Quote"
                      className="w-8 h-8 p-1 m-2"
                    />
                  </div>
                  <p
                    className="text-black-700 text-left mt-2 p-4"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="flex items-center mt-4 bg-orange-100 p-2 rounded-lg w-full">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="font-semibold">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
