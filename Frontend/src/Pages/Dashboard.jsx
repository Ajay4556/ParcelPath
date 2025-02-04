import React, { useEffect } from "react";
import { Navbar } from "../Shared/Navbar";
import { Footer } from "../Shared/Footer";
import { api } from "../API/api.js";
const Dashboard = () => {
  const [deliveries, setDeliveries] = React.useState([]);

  const getDeliveries = async () => {
    const response = await api.get("/delivery/recent-deliveries");
    const data = await response.data;
    setDeliveries(data);
  };

  useEffect(() => {
    getDeliveries();
  }, []);
  return (
    <div className="font-sans">
      {/* Hero Section with Navbar */}
      <div
        className="relative h-[600px] bg-cover bg-center text-white"
        style={{ backgroundImage: "url('Assets/Images/image.png')" }}
      >
        <Navbar />
        <div className="flex items-center justify-start h-full pl-10">
          <div
            className="max-w-2xl p-8 rounded-md"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <h1
              className="text-4xl font-bold leading-tight"
              style={{ fontFamily: "Poppins, sans-serif", width: "700px" }}
            >
              "Connecting You to Reliable Delivery Providers for Seamless Parcel
              Transport"
            </h1>
            <p
              className="mt-4 text-lg"
              style={{ fontFamily: "Poppins, sans-serif", width: "560px" }}
            >
              Flexible, affordable, and convenient delivery solutions tailored
              to your needs.
            </p>
            <button className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 font-bold">
              Post Trip
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
              <p className="text-gray-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        className="py-16 text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <h2 className="text-2xl font-bold">Why Choose Us</h2>
        <div className="w-16 h-1 bg-orange-500 mt-2 mb-6 mx-auto"></div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
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
              <p className="text-gray-600 mt-1 text-left">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Delivery Section */}
      <section
        className="py-16 text-center bg-gray-100"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <h2 className="text-2xl font-bold">Recent Delivery</h2>
        <div className="w-16 h-1 bg-orange-500 mt-2 mb-6 mx-auto"></div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {deliveries.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden relative"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 mb-8 ml-4">
                <h3 className="text-lg text-left font-bold">{item.title}</h3>
                <div className="text-gray-600 flex items-center mt-2">
                  <img
                    src="/Assets/Images/icons/normal_location.png"
                    alt="location"
                    className="w-5 h-5 mr-2"
                  />
                  {item.from}
                </div>
                <div className="text-gray-600 flex items-center mt-1">
                  <img
                    src="/Assets/Images/icons/bold_location.png"
                    alt="location"
                    className="w-5 h-5 mr-2"
                  />
                  {item.to}
                </div>
              </div>
              <div className="absolute bottom-0 right-0  text-white bg-gray-800 w-1/3 h-10 flex items-center justify-center rounded">
                {item.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="relative flex flex-col items-center text-center bg-[#fdfaf6] p-10 rounded-2xl shadow-md"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <img
          src="Assets/Images/abstract/abstract.png"
          alt="Abstract Design"
          className="absolute top-0 left-0 w-32 h-32 rotate-180"
        />
        <img
          src="Assets/Images/abstract/abstract.png"
          alt="Abstract Design"
          className="absolute bottom-0 right-0 w-32 h-32 transform "
        />
        <h2 className="text-2xl font-bold text-gray-900">
          "Choose Your Role and Get Started!"
        </h2>
        <div className="w-16 h-1 bg-orange-500 mt-2 mb-4"></div>
        <p className="text-gray-700 max-w-2xl mb-6">
          "Our platform is your one-stop solution for seamless delivery
          connections. Whether you're looking to find a trusted provider for
          your parcel or want to maximize your trip by offering delivery
          services, we've got you covered. Choose your role and start your
          journey today!"
        </p>
        <div className="flex gap-4">
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
        className="flex flex-col items-center text-center bg-white  mt-10"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
        <div className="w-16 h-1 bg-orange-500 mt-2 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
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
              className="border rounded-lg shadow-md  bg-[#fdfaf6] flex flex-col justify-between h-full "
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

      <Footer />
    </div>
  );
};

export default Dashboard;
