import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          variant="h4"
          fontWeight="Regular"
          color="white"
          style={{ fontFamily: "'Kaushan Script', cursive" }}
        >
          PARCELPATH
        </Typography>
      </Box>
      <ul className="hidden md:flex space-x-6">
        <li>
          <Link to="/" className="text-white hover:text-orange-500">
            Home
          </Link>
        </li>
        <li>
          <Link to="/post-trip" className="text-white hover:text-orange-500">
            Post Trip
          </Link>
        </li>
        <li>
          <Link to="/about-us" className="text-white hover:text-orange-500">
            About Us
          </Link>
        </li>
        <li>
          <Link to="/contact-us" className="text-white hover:text-orange-500">
            Contact Us
          </Link>
        </li>
      </ul>
      <div className="space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white hover:text-orange-500"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/">
              <button className="text-white hover:text-orange-500">
                Login
              </button>
            </Link>
            <Link to="/">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
