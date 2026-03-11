import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineTrash, HiOutlineEye, HiOutlineUserGroup } from 'react-icons/hi';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { useAuth } from '../context/AuthContext.jsx';
import { itemAPI } from '../services/api.js';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    resolvedItems: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const response = await itemAPI.getAllItems();
      if (response.success) {
        setAllItems(response.data);
        calculateStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (items) => {
    const lostItems = items.filter(item => item.itemType === 'Lost').length;
    const foundItems = items.filter(item => item.itemType === 'Found').length;
    const resolvedItems = items.filter(item => item.status === 'Resolved').length;

    setStats({
      totalItems: items.length,
      lostItems,
      foundItems,
      resolvedItems,
    });
  };

  const handleDeleteItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setAllItems(allItems.filter(item => item.id !== id));
      alert('Item deleted successfully!');
    }
  };

  const filteredItems = selectedFilter === 'All' 
    ? allItems 
    : allItems.filter(item => item.itemType === selectedFilter);

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
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
            >
              <HiOutlineArrowLeft className="text-2xl" /> Back to Home
            </button>
            <h1 className="text-5xl font-bold flex items-center gap-3">
              <HiOutlineUserGroup /> Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-300">Manage all lost and found items</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Stats Section */}
          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <p className="text-4xl font-bold text-green-600 mb-2">{stats.totalItems}</p>
              <p className="text-gray-700 font-semibold">Total Items</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <p className="text-4xl font-bold text-red-600 mb-2">{stats.lostItems}</p>
              <p className="text-gray-700 font-semibold">Lost Items</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <p className="text-4xl font-bold text-green-600 mb-2">{stats.foundItems}</p>
              <p className="text-gray-700 font-semibold">Found Items</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <p className="text-4xl font-bold text-blue-600 mb-2">{stats.resolvedItems}</p>
              <p className="text-gray-700 font-semibold">Resolved Items</p>
            </motion.div>
          </motion.div>

          {/* Filter & Items Section */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              {['All', 'Lost', 'Found'].map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-6 py-2 rounded-lg font-bold transition ${
                    selectedFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {filter}
                </motion.button>
              ))}
            </div>

            {/* Items Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-700">Loading items...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-200">
                      <th className="px-6 py-4 text-left font-bold text-gray-800">Item Name</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-800">Type</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-800">Category</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-800">Location</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-800">Status</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, idx) => (
                      <motion.tr
                        key={item.id}
                        className="border-b border-gray-200 hover:bg-green-50 transition"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800">{item.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
                            item.itemType === 'Lost' ? 'bg-red-500' : 'bg-green-600'
                          }`}>
                            {item.itemType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{item.category}</td>
                        <td className="px-6 py-4 text-gray-700">{item.location}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
                            item.status === 'Active' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}>
                            {item.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <motion.button
                              onClick={() => navigate(`/item/${item.id}`)}
                              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
                              whileHover={{ scale: 1.1 }}
                            >
                              <HiOutlineEye className="text-lg" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteItem(item.id)}
                              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                              whileHover={{ scale: 1.1 }}
                            >
                              <HiOutlineTrash className="text-lg" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No items found.</p>
              </div>
            )}
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}
