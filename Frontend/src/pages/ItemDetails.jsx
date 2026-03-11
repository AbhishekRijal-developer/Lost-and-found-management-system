import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function ItemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const itemData = {
    name: "Blue Wallet",
    category: "Wallet/Purse",
    location: "City Center Mall",
    date: "2 days ago",
    description: "Dark blue leather wallet with ID cards and some cash. Very important to me. Any info appreciated!",
    image: "💼",
    reporterName: "John Doe",
    reporterPhone: "+977-9841234567",
    reporterEmail: "john@example.com",
    images: ["💼", "💼", "💼"],
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
          <h1 className="text-4xl font-bold">{itemData.name}</h1>
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
          {/* Images Section */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="h-96 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-9xl">
                {itemData.image}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-700 mb-4">More Images</h3>
                <div className="grid grid-cols-3 gap-4">
                  {itemData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-4xl cursor-pointer hover:shadow-lg transition"
                    >
                      {img}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-8"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-gray-700">Category:</p>
                  <p className="text-gray-600">{itemData.category}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Location:</p>
                  <p className="text-gray-600">{itemData.location}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Date:</p>
                  <p className="text-gray-600">{itemData.date}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Description:</p>
                  <p className="text-gray-600">{itemData.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Reporter Info & Actions */}
          <motion.div className="md:col-span-1" variants={itemVariants}>
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Reporter Info</h3>
              
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  👤
                </div>
                <p className="text-center font-bold text-gray-800 text-lg">{itemData.reporterName}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <HiOutlinePhone className="text-green-600 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-800">{itemData.reporterPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                  <HiOutlineMail className="text-pink-600 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">{itemData.reporterEmail}</p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => alert("Message sent to reporter!")}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition mb-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                📧 Send Message
              </motion.button>

              <motion.button
                onClick={() => alert("Call initiated!")}
                className="w-full bg-gradient-to-r from-black to-gray-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                📞 Call Reporter
              </motion.button>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-gray-700">
                  ⚠️ <span className="font-semibold">Safety Tip:</span> Meet in a public place and verify the item before exchanging.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
    </>
  );
}
