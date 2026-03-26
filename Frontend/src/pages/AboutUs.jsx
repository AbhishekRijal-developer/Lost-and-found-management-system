import React from "react";
import { motion } from "framer-motion";
import { FiInstagram, FiLink } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io5";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function AboutUsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-green-50 to-white flex flex-col">

      {/* Header Section */}
      <motion.div 
        className="w-full py-16 px-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-green-600 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          About Us
        </motion.h1>
        <p className="text-gray-600 text-lg">Discover our mission</p>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-10">
        
        {/* Mission Section */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-3xl p-12 shadow-2xl overflow-hidden relative"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
              <motion.h2 
                className="text-4xl font-bold mb-6 flex items-center gap-3"
                variants={itemVariants}
              >
                <span className="text-5xl">✓</span> Our Mission
              </motion.h2>
              <motion.p 
                className="text-lg leading-relaxed max-w-2xl"
                variants={itemVariants}
              >
                Our mission is to create a reliable and efficient platform for reuniting lost items with their rightful owners. We aim to foster a supportive community where users can easily report, search, and recover lost belongings, enhancing trust and cooperation among individuals.
              </motion.p>
              <motion.p 
                className="text-lg leading-relaxed max-w-2xl mt-4 opacity-90"
                variants={itemVariants}
              >
                By leveraging technology, we strive to reduce the time, effort, and stress associated with finding lost items, ensuring a seamless and satisfying experience for all our users.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>


        {/* Features Section */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 text-green-600"
            variants={itemVariants}
          >
            Why Choose Us?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "", title: "Fast & Efficient", desc: "Quick search and recovery process" },
              { icon: "", title: "Community Driven", desc: "Help from a caring community" },
              { icon: "", title: "Secure & Safe", desc: "Your data is protected" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          className="mb-16 bg-gradient-to-r from-green-100/30 to-green-200/30 rounded-3xl p-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1000+", label: "Users" },
              { number: "500+", label: "Items Found" },
              { number: "95%", label: "Success Rate" },
              { number: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <motion.p 
                  className="text-4xl font-bold text-green-600 mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  {stat.number}
                </motion.p>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>


        <div className="bg-black text-white rounded-lg mx-auto my-10 px-10 py-8 w-[90%] sm:w-[80%] shadow-xl">
          <h2 className="text-center text-2xl font-semibold mb-4">Our mission</h2>
          <p className="text-center text-sm leading-relaxed">
            “Our mission is to create a reliable and efficient platform for reuniting lost items
            with their rightful owners. We aim to foster a supportive community where users can
            easily report, search, and recover lost belongings, enhancing trust and cooperation
            among individuals. By leveraging technology, we strive to reduce the time, effort, and
            stress associated with finding lost items, ensuring a seamless and satisfying
            experience for all our users.”
          </p>
        </div>
      </div>

      <div className="w-full mt-10">
       

      </div>

      <Footer />
    </div>
    </>
  );
}
