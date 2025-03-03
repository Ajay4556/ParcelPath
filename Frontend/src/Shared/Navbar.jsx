import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return true;
      else return false;
    };

    const isSessionTokenPresent = checkCookie("authjs.session-token");
    setIsLoggedIn(isSessionTokenPresent);
  }, []);

  const handleLogout = () => {
    document.cookie =
      "authjs.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          color="black"
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
      <ul className="hidden md:flex space-x-6">
        <li>
          <Link to="/" className="text-gray-600 hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link to="/posttrip" className="text-gray-600 hover:text-gray-400">
            Post Trip
          </Link>
        </li>
        <li>
          <Link to="/findtrip" className="text-gray-600 hover:text-gray-400">
            Find Trip
          </Link>
        </li>
      </ul>

      {/* Authentication Buttons */}
      <div className="hidden md:flex space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-400"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">
              <button className="text-gray-600 hover:text-gray-400">
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

            <li className="w-full border-t border-gray-700"></li>
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
