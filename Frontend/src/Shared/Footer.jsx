import React from "react";
import { Box, Typography } from "@mui/material";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-10 mt-12">
      <div className="max-w-6xl mx-auto flex flex-wrap md:flex-nowrap justify-between items-start">
        {/* Logo and Help Section */}
        <div className="w-full md:w-1/3 mb-8 md:mb-0 flex flex-col items-start">
          {/* Logo */}
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
          {/* Help Section */}
          <p className="mt-4">Need Help?</p>
          <div className="flex mt-2">
            <input type="email" placeholder="Email Address" className="p-2 " />
            <button className="bg-orange-500 text-white px-4 ">Ok</button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="w-full md:w-1/3 mb-8 md:mb-0 flex flex-col items-center">
          <a href="/" className="block hover:text-orange-500 mb-2">
            Home
          </a>
          <a href="/" className="block hover:text-orange-500 mb-2">
            About Us
          </a>
          <a href="/" className="block hover:text-orange-500 mb-2">
            Contact Us
          </a>
          <a href="/" className="block hover:text-orange-500 mb-2">
            Post Trip
          </a>
        </div>

        {/* Social Media Links */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <a href="/" className="flex items-center hover:text-orange-500 mb-2">
            <FaFacebookF className="mr-2 text-lg" /> Facebook
          </a>
          <a href="/" className="flex items-center hover:text-orange-500 mb-2">
            <FaTwitter className="mr-2 text-lg" /> Twitter
          </a>
          <a href="/" className="flex items-center hover:text-orange-500 mb-2">
            <FaInstagram className="mr-2 text-lg" /> Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};
