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

  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Student",
      quote:
        "I found my lost wallet within a day. The platform made connecting with the finder super easy and safe.",
      rating: 5
    },
    {
      name: "Meera Nair",
      role: "Working Professional",
      quote:
        "Posting a found phone took less than two minutes. The owner reached out quickly and recovered it.",
      rating: 5
    },
    {
      name: "Rohan Verma",
      role: "Community Volunteer",
      quote:
        "This system builds trust in the community. I have helped return multiple items through one dashboard.",
      rating: 4
    }
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

      {/* Testimonial Section */}
      <motion.div
        className="max-w-7xl mx-auto px-6 mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-3xl font-bold text-center mb-4 text-black">What our users say</h3>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Real stories from people who successfully reported and recovered their belongings.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl p-8 shadow-lg border border-green-100"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <p className="text-green-600 text-xl mb-4">
                {"★".repeat(testimonial.rating)}
                <span className="text-gray-300">{"★".repeat(5 - testimonial.rating)}</span>
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold text-black">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      

      <Footer />
    </div>
    </>
  );
}
