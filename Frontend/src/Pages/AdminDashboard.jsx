import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Import the modal library
import { Footer } from "../Shared/Footer";
import { Navbar } from "../Shared/Navbar";
import { api } from "../API/api";
import { getUserData } from "../components/LoginHandler";
import { useNavigate } from "react-router";

Modal.setAppElement("#root"); // Set the app element for accessibility

const AdminDashboard = () => {
  const [userData, setUserData] = useState({});
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await getUserData();
          setUserData(user);
        } else {
          navigate("/login"); // Redirect to login if no token
        }
      } catch (err) {
        console.log("Error fetching user");
        setError("Failed to fetch user data.");
      }
    };

    const fetchProviders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/admin/fetchProviders"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchProviders();
  }, [navigate]);

  const handleVerify = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/verifyProvider/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify provider");
      }

      setProviders(
        providers.map((provider) =>
          provider._id === id ? { ...provider, isVerified: true } : provider
        )
      );
    } catch (error) {
      alert("Error verifying provider: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/auth/deleteUser/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete provider");
      }

      setProviders(providers.filter((provider) => provider._id !== id));
    } catch (error) {
      alert("Error deleting provider: " + error.message);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-8 mt-10">
        <div className="text-center mb-8 mt-10">
          <div className="inline-block relative">
            <img
              src={
                userData?.profileImage ||
                "https://www.gravatar.com/avatar/?d=mp"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white -mt-12"
            />
            <span className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
              <img src="camera-icon.png" alt="Edit" className="w-6 h-6" />
            </span>
          </div>
          <h2 className="text-2xl font-bold">Welcome, {userData?.fullName}</h2>
          <p className="text-gray-600">Verify Service Providers Below:</p>
        </div>
        <section className="max-w-2xl mx-auto bg-white shadow rounded p-6">
          <h3 className="text-xl font-bold mb-4">Unverified Providers</h3>
          {providers.length === 0 ? (
            <p>No unverified providers found.</p>
          ) : (
            <div>
              {providers.map((provider) => (
                <div
                  key={provider._id}
                  className="flex items-center justify-between p-4 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-bold">{provider.name}</p>
                    <p className="text-gray-600">{provider.email}</p>
                    {provider.gLicenseImage && (
                      <div>
                        <p>G License:</p>
                        <img
                          src={provider.gLicenseImage}
                          alt="G License"
                          className="w-16 h-16 object-cover rounded cursor-pointer"
                          onClick={() => openImageModal(provider.gLicenseImage)}
                        />
                      </div>
                    )}
                    {provider.companyRegistrationImage && (
                      <div>
                        <p>Company Registration:</p>
                        <img
                          src={provider.companyRegistrationImage}
                          alt="Company Registration"
                          className="w-16 h-16 object-cover rounded cursor-pointer"
                          onClick={() =>
                            openImageModal(provider.companyRegistrationImage)
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    {provider.isVerified ? (
                      <span className="text-green-500">✅ Verified</span>
                    ) : (
                      <button
                        onClick={() => handleVerify(provider._id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        ✔️ Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(provider._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Modal
        isOpen={!!selectedImage}
        onRequestClose={closeImageModal}
        contentLabel="Image Zoom"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
      >
        <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-w-lg">
          <button
            onClick={closeImageModal}
            className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800"
          >
            ✖️
          </button>
          {selectedImage && (
            <img src={selectedImage} alt="Zoomed" className="w-full h-auto" />
          )}
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
