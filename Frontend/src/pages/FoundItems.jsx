import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineSearch } from "react-icons/hi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { itemAPI } from "../services/api.js";

export default function FoundItems() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["All", "Electronics", "Documents", "Jewelry", "Keys", "Wallet/Purse", "Phone", "Bag", "Clothing", "Accessories"];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await itemAPI.getAllItems();
        if (response.success) {
          // Filter only Found items
          const foundItems = response.data.filter(item => item.itemType === 'Found');
          setItems(foundItems);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <HiOutlineArrowLeft className="text-2xl" /> Back
          </button>
          <h1 className="text-4xl font-bold">Found Items</h1>
          <p className="mt-2 text-green-100">Check if your lost item has been found</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Search Bar */}
          <div className="relative mb-8">
            <HiOutlineSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by item name..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <p className="font-bold text-gray-700 mb-4">Filter by Category:</p>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="inline-block"
            >
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"></div>
            </motion.div>
            <p className="mt-4 text-gray-600">Loading found items...</p>
          </div>
        ) : error ? (
          <motion.div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-semibold">Error loading items</p>
            <p className="text-sm mt-2">{error}</p>
          </motion.div>
        ) : filteredItems.length > 0 ? (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <div className="h-40 bg-gradient-to-br from-green-300 to-emerald-300 flex items-center justify-center text-lg font-semibold text-gray-700 p-4 text-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>📦 No Image</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Category:</span> {item.category || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Location:</span> {item.location || "Not specified"}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Found: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm">
                      View Details
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
                      Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-2xl text-gray-600 mb-4">No found items match your search</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
    </>
  );
}
