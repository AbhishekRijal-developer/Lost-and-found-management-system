import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineTrash } from "react-icons/hi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { itemAPI } from "../services/api.js";

export default function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await itemAPI.getMyItems();
        if (response.success) {
          setReports(response.data);
        }
      } catch (err) {
        setError(err.message || "Failed to load your reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      await itemAPI.deleteItem(id);
      setReports((prev) => prev.filter((report) => report.id !== id));
      alert("Report deleted successfully!");
    } catch (err) {
      alert(err.message || "Failed to delete report");
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

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
          <h1 className="text-4xl font-bold">My Reports</h1>
          <p className="mt-2 text-blue-100">Manage your lost and found item reports</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Action Buttons */}
        <motion.div
          className="flex gap-4 mb-8 flex-wrap"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => navigate("/report-lost")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Report Lost Item
          </motion.button>
          <motion.button
            onClick={() => navigate("/report-found")}
            className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Report Found Item
          </motion.button>
        </motion.div>

        {/* Reports List */}
        {loading && (
          <div className="text-center py-10 text-gray-600">Loading your reports...</div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        )}
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reports.map((report) => (
            <motion.div
              key={report.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              variants={itemVariants}
            >
              <div className="flex flex-col md:flex-row items-center gap-6 p-8">
                {/* Image */}
                <div className={`w-24 h-24 rounded-lg flex items-center justify-center text-5xl flex-shrink-0 ${
                  report.itemType === "Lost" ? "bg-red-100" : "bg-green-100"
                }`}>
                  {report.itemType === "Lost" ? "🔴" : "🟢"}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{report.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      report.itemType === "Lost" 
                        ? "bg-red-100 text-red-700" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {report.itemType}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Category:</span> {report.category}
                  </p>
                  <p className="text-gray-500 text-sm">Reported {new Date(report.createdAt).toLocaleDateString()}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      report.status === "Active"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full md:w-auto">
                  <motion.button
                    onClick={() => navigate(`/item/${report.id}`)}
                    className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(report.id)}
                    className="flex-1 md:flex-none bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HiOutlineTrash /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {!loading && reports.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-2xl text-gray-600 mb-6">No reports yet</p>
            <motion.button
              onClick={() => navigate("/report-lost")}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
              whileHover={{ scale: 1.05 }}
            >
              Create Your First Report
            </motion.button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
    </>
  );
}
