import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { itemAPI } from "../services/api.js";
import { chatAPI } from "../services/chatAPI.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ItemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await itemAPI.getItemById(id);
        if (response.success) {
          setItemData(response.data);
        }
      } catch (err) {
        setError(err.message || "Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSendMessage = async () => {
    if (!itemData?.reporterId) {
      alert("Cannot send message for this item.");
      return;
    }

    if (!user?.id) {
      navigate("/login");
      return;
    }

    if (Number(user.id) === Number(itemData.reporterId)) {
      alert("This is your own report.");
      return;
    }

    try {
      setMessageLoading(true);
      const result = await chatAPI.sendMessage(
        itemData.id,
        itemData.reporterId,
        `Hi, I am contacting you regarding: ${itemData.title}`
      );

      if (result.success) {
        alert("Message sent successfully!");
        navigate("/chat");
      }
    } catch (err) {
      alert(err?.message || "Failed to send message");
    } finally {
      setMessageLoading(false);
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center">
          <p className="text-gray-600 text-lg">Loading item details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !itemData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center px-6">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg w-full max-w-xl">
            {error || "Item not found"}
          </div>
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
          <h1 className="text-4xl font-bold">{itemData.title}</h1>
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
                {itemData.imageUrl ? (
                  <img src={itemData.imageUrl} alt={itemData.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-gray-500">No Image</span>
                )}
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
                  <p className="text-gray-600">{new Date(itemData.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Description:</p>
                  <p className="text-gray-600">{itemData.description}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Status:</p>
                  <p className="text-gray-600">{itemData.status}</p>
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
                
                </div>
                <p className="text-center font-bold text-gray-800 text-lg">{itemData.reporterName || "Unknown User"}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <HiOutlinePhone className="text-green-600 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-800">{itemData.reporterPhone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                  <HiOutlineMail className="text-pink-600 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">{itemData.reporterEmail || itemData.contactEmail || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleSendMessage}
                disabled={messageLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                 {messageLoading ? "Sending..." : "Send Message"}
              </motion.button>

              <motion.button
                onClick={() => {
                  if (itemData.reporterPhone) {
                    window.location.href = `tel:${itemData.reporterPhone}`;
                  }
                }}
                disabled={!itemData.reporterPhone}
                className="w-full bg-gradient-to-r from-black to-gray-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                 Call Reporter
              </motion.button>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-gray-700">
                   <span className="font-semibold">Safety Tip:</span> Meet in a public place and verify the item before exchanging.
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
