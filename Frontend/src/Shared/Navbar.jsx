import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { getUserData } from "../components/LoginHandler.js";

export const Navbar = ({ isWhite }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
          const user = await getUserData();
          setUserData(user);
          setUserName(user.fullName);
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
    setIsLoggedIn(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const style = isWhite ? "text-white text-gray-600 hover:text-gray-400" : "text-gray-600 hover:text-gray-400";

  return (
    <nav
      className="flex justify-between items-center p-4 bg-transparent absolute w-full"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <Box display="flex" alignItems="center">
        <img
          src="Assets/Images/logo.png"
          alt="Logo"
          style={{ height: "50px", marginRight: "16px" }}
        />
        <Typography
          variant="h5"
          fontWeight="Regular"
          color={isWhite ? "white" : "black"}
          style={{ fontFamily: "'Kaushan Script', cursive" }}
        >
          PARCELPATH
        </Typography>
      </Box>

      {/* Hamburger Menu Icon for Mobile */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className="text-gray-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      {userData && Object.keys(userData).length > 0 && (
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className={style}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/findtrip" className={style}>
              Find Trip
            </Link>
          </li>
          {userData.role === "service provider" && (
            <>
              <li>
                <Link
                  to="/posttrip"
                  className={style}
                >
                  Post Trip
                </Link>
              </li>
            </>
          )}
          {userData.role === "admin" && (
            <>
              <li>
                <Link
                  to="/featured-trips"
                  className={style}
                >
                  Set Featured Trips
                </Link>
              </li>
            </>
          )}
        </ul>
      )}

      {/* Authentication Buttons */}
      <div className="hidden md:flex space-x-4">
        {isLoggedIn ? (
          <>
            <Link
              to={
                userData.role === "service provider"
                  ? "/provider-dashboard"
                  : userData.role === "admin"
                  ? "/admin-dashboard"
                  : "/customer-dashboard"
              }
              className={isWhite ? "text-white-600 capitalize" : "text-gray-600 capitalize"}
            >
              {userName}
            </Link>
            <button
              onClick={handleLogout} // Ensure the function is called correctly
              className={style}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className={style}>
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 text-white md:hidden z-10">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <Link
                to="/"
                className="hover:text-white-400"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/posttrip"
                className="hover:text-gray-400"
                onClick={toggleMenu}
              >
                Post Trip
              </Link>
            </li>
            <li>
              <Link
                to="/findtrip"
                className="hover:text-gray-400"
                onClick={toggleMenu}
              >
                Find Trip
              </Link>
            </li>

            {/* <li className="w-full border-t border-gray-700"></li> */}
            {isLoggedIn ? (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="hover:text-gray-400"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-gray-400"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" onClick={toggleMenu}>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                      Sign Up
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};
