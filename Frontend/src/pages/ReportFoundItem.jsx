import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { useAuth } from "../context/AuthContext.jsx";
import { itemAPI } from "../services/api.js";

export default function ReportFoundItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    location: "",
    date: "",
    imageUrl: "",
    contact: "",
  });

  const categories = [
    "Electronics", "Documents", "Jewelry", "Keys", "Wallet/Purse", 
    "Phone", "Bag", "Clothing", "Accessories", "Other"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }

    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError("Image size must be 2MB or less.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((previous) => ({
        ...previous,
        imageUrl: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || !user.id) {
      setError("You must be logged in to report an item");
      navigate("/login");
      return;
    }

    if (!formData.itemName || !formData.category || !formData.description || !formData.location || !formData.contact) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await itemAPI.createItem({
        userId: user.id,
        title: formData.itemName,
        category: formData.category,
        description: formData.description,
        itemType: "Found",
        location: formData.location,
        contactPhone: formData.contact,
        contactEmail: user.email,
        imageUrl: formData.imageUrl,
      });

      if (response.success) {
        setSuccess("Found item reported successfully!");
        setTimeout(() => navigate("/my-reports"), 1200);
      }
    } catch (err) {
      setError(err.message || "Failed to report found item");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <HiOutlineArrowLeft className="text-2xl" /> Back
          </button>
          <h1 className="text-4xl font-bold">Report Found Item</h1>
          <p className="mt-2 text-green-100">Help someone find their lost belongings</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error && (
            <motion.div
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div 
              className="grid md:grid-cols-2 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Item Name */}
              <motion.div variants={itemVariants}>
                <label className="block font-bold text-gray-700 mb-2">Item Name *</label>
                <input
                  type="text"
                  name="itemName"
                  placeholder="e.g., Black Wallet"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              {/* Category */}
              <motion.div variants={itemVariants}>
                <label className="block font-bold text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </motion.div>

              {/* Location Found */}
              <motion.div variants={itemVariants}>
                <label className="block font-bold text-gray-700 mb-2">Found Location *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Where did you find it?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              {/* Date Found */}
              <motion.div variants={itemVariants}>
                <label className="block font-bold text-gray-700 mb-2">Date Found *</label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              {/* Contact */}
              <motion.div variants={itemVariants}>
                <label className="block font-bold text-gray-700 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  name="contact"
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              {/* Image Upload */}
              <motion.div variants={itemVariants}>
                <label className="block font-bold text-gray-700 mb-2">Item Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  onChange={handleImageUpload}
                />
                <p className="text-xs text-gray-500 mt-2">Optional. JPG, PNG, GIF or WEBP up to 2MB.</p>
              </motion.div>
            </motion.div>

            {formData.imageUrl && (
              <motion.div variants={itemVariants} className="mb-8">
                <p className="block font-bold text-gray-700 mb-2">Image Preview</p>
                <img
                  src={formData.imageUrl}
                  alt="Found item preview"
                  className="w-full max-w-sm h-56 object-cover rounded-lg border border-gray-200"
                />
              </motion.div>
            )}

            {/* Description */}
            <motion.div variants={itemVariants} className="mb-8">
              <label className="block font-bold text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                placeholder="Describe the item in detail (color, brand, condition, any identification marks, etc.)"
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Reporting..." : "Report Found Item"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
    </>
  );
}
