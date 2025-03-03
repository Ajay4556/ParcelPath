import React from "react";
import { Footer } from "../Shared/Footer";

const recentTrips = [
  { id: 1, route: "Kitchener To Guelph", date: "Friday, January 31 at 3:50am" },
  {
    id: 2,
    route: "Toronto To Waterloo",
    date: "Wednesday, January 28 at 2:50am",
  },
  {
    id: 3,
    route: "Cambridge To Guelph",
    date: "Tuesday, January 20 at 3:50am",
  },
  { id: 4, route: "Kitchener To Guelph", date: "Friday, January 31 at 3:50am" },
];

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="Assets/Images/logo.png" alt="Logo" className="h-8 mr-2" />
          <span
            className="font-bold text-xl"
            style={{ fontFamily: "Kaushan Script" }}
          >
            PARCELPATH
          </span>
        </div>
        <nav className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-black">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-black">
            Trips
          </a>
          <a href="#" className="text-gray-600 hover:text-black">
            Dashboard
          </a>
        </nav>
        <div className="flex space-x-4">
          <button className="text-gray-600 hover:text-black">Login</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Sign Up
          </button>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-8">
        <div className="bg-gray-800 h-40 mb-8"></div>
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <img
              src="profile.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white -mt-12"
            />
            <span className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
              <img src="camera-icon.png" alt="Edit" className="w-6 h-6" />
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-4">Khusan Akhmedov</h2>
          <p className="text-gray-600">Welcome back to Parcelpath!</p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded mt-4">
            Get Start
          </button>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-4">Recent Trips</h2>
          <div className="bg-white shadow rounded">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center p-4 border-b last:border-b-0"
              >
                <img
                  src="profile.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="font-bold">{trip.route}</p>
                  <p className="text-gray-600">{trip.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
