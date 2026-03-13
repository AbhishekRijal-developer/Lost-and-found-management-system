import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function Home() {
  const navigate = useNavigate();

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

  const features = [
    {
      icon: "",
      title: "Report Lost Item",
      desc: "Report your lost belongings",
      route: "/report-lost",
      color: "from-gray-700 to-gray-800"
    },
    {
      icon: "",
      title: "Report Found Item",
      desc: "Help others by reporting found items",
      route: "/report-found",
      color: "from-green-600 to-green-700"
    },
    {
      icon: "",
      title: "Browse Lost Items",
      desc: "Search lost items database",
      route: "/lost-items",
      color: "from-black to-gray-800"
    },
    {
      icon: "",
      title: "Browse Found Items",
      desc: "Check found items",
      route: "/found-items",
      color: "from-green-600 to-green-700"
    },
    {
      icon: "",
      title: "My Reports",
      desc: "View your posted reports",
      route: "/my-reports",
      color: "from-gray-700 to-gray-800"
    },
    {
      icon: "",
      title: "My Profile",
      desc: "Manage your account",
      route: "/profile",
      color: "from-green-600 to-green-700"
    }
  ];

  const stats = [
    { label: "Active Users", value: "1,250+" },
    { label: "Items Found", value: "850+" },
    { label: "Items Lost", value: "450+" },
    { label: "Success Rate", value: "92%" }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
        {/* Hero Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-6 py-16 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
        <motion.h2 
          className="text-5xl md:text-6xl font-bold mb-4 text-green-600"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          Welcome Home!
        </motion.h2>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Find your lost items or help others recover theirs. Our community-driven platform makes it easy.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 mb-16 grid md:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <p className="text-4xl font-bold text-green-600 mb-2">
              {stat.value}
            </p>
            <p className="text-gray-700 font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Features Grid */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-3xl font-bold text-center mb-12 text-black">What would you like to do?</h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="group cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onClick={() => navigate(feature.route)}
            >
              <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all h-full`}>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h4 className="text-2xl font-bold mb-2">{feature.title}</h4>
                <p className="text-white/90 mb-4">{feature.desc}</p>
                <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition">
                  Start <span className="ml-2">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-3xl font-bold mb-8 text-black">Recently Posted</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-6xl">
                □
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-2">Lost: Blue Wallet</h4>
                <p className="text-gray-600 text-sm mb-4">Posted 2 hours ago near City Center</p>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <Footer />
    </div>
    </>
  );
}
