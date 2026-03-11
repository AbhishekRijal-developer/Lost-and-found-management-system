import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function ReportFoundItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    location: "",
    date: "",
    image: null,
    contact: "",
  });

  const categories = [
    "Electronics", "Documents", "Jewelry", "Keys", "Wallet/Purse", 
    "Phone", "Bag", "Clothing", "Accessories", "Other"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Found item reported successfully!");
    navigate("/my-reports");
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
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                />
              </motion.div>
            </motion.div>

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
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all duration-300 text-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Report Found Item
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
    </>
  );
}
