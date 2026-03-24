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
    bio: "",
    department: "",
    batch: "",
    location: "",
    profilePicture: "",
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    itemsFound: 0,
    helpfulRating: 0,
  });

  const [tempData, setTempData] = useState(userData);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setStatsLoading(true);
        const [profileResponse, statsResponse] = await Promise.all([
          authAPI.getCurrentUser(),
          authAPI.getProfileStats(),
        ]);

        if (profileResponse.success) {
          const profile = {
            name: profileResponse.data.name || "",
            email: profileResponse.data.email || "",
            phone: profileResponse.data.phone || "",
            bio: profileResponse.data.bio || "",
            department: profileResponse.data.department || "",
            batch: profileResponse.data.batch || "",
            location: profileResponse.data.location || "",
            profilePicture: profileResponse.data.profilePicture || "",
          };
          setUserData(profile);
          setTempData(profile);
        }

        if (statsResponse.success) {
          setStats({
            totalReports: statsResponse.data.totalReports || 0,
            itemsFound: statsResponse.data.itemsFound || 0,
            helpfulRating: statsResponse.data.helpfulRating || 0,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const getInitials = (name) => {
    if (!name || !name.trim()) {
      return "U";
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((segment) => segment[0].toUpperCase())
      .join("");
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert("Profile picture must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempData((previous) => ({
        ...previous,
        profilePicture: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await authAPI.updateProfile({
        name: tempData.name,
        phone: tempData.phone,
        bio: tempData.bio,
        department: tempData.department,
        batch: tempData.batch,
        location: tempData.location,
        profilePicture: tempData.profilePicture,
      });

      if (response.success) {
        const updatedUser = {
          ...response.data,
        };
        setUserData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          bio: updatedUser.bio || "",
          department: updatedUser.department || "",
          batch: updatedUser.batch || "",
          location: updatedUser.location || "",
          profilePicture: updatedUser.profilePicture || "",
        });
        setTempData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          bio: updatedUser.bio || "",
          department: updatedUser.department || "",
          batch: updatedUser.batch || "",
          location: updatedUser.location || "",
          profilePicture: updatedUser.profilePicture || "",
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

  const statsCards = [
    { label: "Total Reports", value: stats.totalReports },
    { label: "Items Found", value: stats.itemsFound },
    { label: "Helpful Rating", value: `${stats.helpfulRating}%` },
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
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-4xl text-white font-bold">
                    {tempData.profilePicture || userData.profilePicture ? (
                      <img
                        src={tempData.profilePicture || userData.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(tempData.name || userData.name)}</span>
                    )}
                  </div>
                  <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                    whileHover={{ scale: 1.05 }}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </motion.button>
                </div>

                {isEditing && (
                  <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 file:font-semibold hover:file:bg-green-200"
                    />
                    <p className="text-xs text-gray-500 mt-2">Upload JPG, PNG or GIF up to 2MB.</p>
                  </div>
                )}

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

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.department}
                        onChange={(e) => setTempData({ ...tempData, department: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. Computer Science"
                      />
                    ) : (
                      <p className="text-gray-800">{userData.department || "Not set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Batch</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.batch}
                        onChange={(e) => setTempData({ ...tempData, batch: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. 2024"
                      />
                    ) : (
                      <p className="text-gray-800">{userData.batch || "Not set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.location}
                        onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. Kathmandu"
                      />
                    ) : (
                      <p className="text-gray-800">{userData.location || "Not set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={tempData.bio}
                        onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        rows={4}
                        placeholder="Tell others something about you"
                      />
                    ) : (
                      <p className="text-gray-800 whitespace-pre-line">{userData.bio || "No bio added yet."}</p>
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
              {statsCards.map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {statsLoading ? "..." : stat.value}
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
