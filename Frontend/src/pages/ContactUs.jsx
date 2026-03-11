import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
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

  const contactInfo = [
    {
      icon: HiOutlinePhone,
      title: "Phone",
      info: "+977-1-4123456",
      color: "from-green-600 to-green-700"
    },
    {
      icon: HiOutlineMail,
      title: "Email",
      info: "support@lostandfound.com",
      color: "from-black to-gray-700"
    },
    {
      icon: HiOutlineLocationMarker,
      title: "Address",
      info: "Kathmandu, Nepal",
      color: "from-green-600 to-green-700"
    },
  ];

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
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-cyan-100">Get in touch with our support team</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {contactInfo.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition`}
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <IconComponent className="text-5xl mb-4" />
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/90">{item.info}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Send us a Message</h2>
          
          <form onSubmit={handleSubmit}>
            <motion.div 
              className="grid md:grid-cols-2 gap-6 mb-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Name */}
              <motion.div variants={itemVariants}>
                <label className="block font-bold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="block font-bold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            </motion.div>

            {/* Subject */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block font-bold text-gray-700 mb-2">Subject *</label>
              <input
                type="text"
                name="subject"
                placeholder="What is this about?"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </motion.div>

            {/* Message */}
            <motion.div variants={itemVariants} className="mb-8">
              <label className="block font-bold text-gray-700 mb-2">Message *</label>
              <textarea
                name="message"
                placeholder="Your message here..."
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all duration-300 text-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How do I report a lost item?",
                a: "Go to 'Report Lost Item' and fill in the details about your lost belongings."
              },
              {
                q: "How do I claim a found item?",
                a: "Contact the reporter through the item details page to verify and claim your item."
              },
              {
                q: "Is my personal information safe?",
                a: "Yes, we protect your information and only share it with authorized users."
              },
              {
                q: "How long are reports active?",
                a: "Reports remain active for 30 days. You can extend or delete them anytime."
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <h3 className="font-bold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
    </>
  );
}
