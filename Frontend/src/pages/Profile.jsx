import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { authAPI } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [tempData, setTempData] = useState(userData);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getCurrentUser();
        if (response.success) {
          const profile = {
            name: response.data.name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
          };
          setUserData(profile);
          setTempData(profile);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await authAPI.updateProfile({
        name: tempData.name,
        phone: tempData.phone,
      });

      if (response.success) {
        const updatedUser = {
          ...response.data,
        };
        setUserData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
        });
        setTempData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
        });

        const existingToken = localStorage.getItem("token");
        if (existingToken) {
          login(updatedUser, existingToken);
        }

        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      alert(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: "Total Reports", value: "--" },
    { label: "Items Found", value: "--" },
    { label: "Helpful Ratings", value: "--" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
          <p className="text-gray-700">Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <HiOutlineArrowLeft className="text-2xl" /> Back
          </button>
          <h1 className="text-4xl font-bold">My Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Card */}
          <motion.div 
            className="md:col-span-2"
            variants={itemVariants}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Cover */}
              <div className="h-32 bg-gradient-to-r from-green-500 to-green-600"></div>

              {/* Profile Info */}
              <div className="px-8 pb-8">
                <div className="flex items-end gap-4 -mt-16 mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-6xl border-4 border-white shadow-lg">
                    👤
                  </div>
                  <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                    whileHover={{ scale: 1.05 }}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </motion.button>
                </div>

                {/* Editable Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.name}
                        onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-800 text-lg font-semibold">{userData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Email</label>
                    <p className="text-gray-800">{userData.email}</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={tempData.phone}
                        onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-800">{userData.phone}</p>
                    )}
                  </div>

                  {isEditing && (
                    <motion.button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div className="md:col-span-1" variants={itemVariants}>
            <div className="space-y-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 font-semibold">{stat.label}</p>
                </motion.div>
              ))}

              {/* Actions */}
              <motion.button
                onClick={() => navigate("/my-reports")}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                 View My Reports
              </motion.button>

              <motion.button
                onClick={() => alert("Settings opened!")}
                className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                 Settings
              </motion.button>

              <motion.button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
    </>
  );
}
