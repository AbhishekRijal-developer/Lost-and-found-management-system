import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import laptopImage from "../assets/laptop.png";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../context/AuthContext.jsx";
import { authAPI } from "../services/api.js";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please fill all fields.");
      return;
    }

    if (!formData.email.endsWith("@iic.edu.np")) {
      setError("Email must end with @iic.edu.np");
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        setSuccess("Login successful!");
        login(response.user, response.token);
        setTimeout(() => navigate('/home'), 1500);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">

        <motion.div
          className="flex flex-col gap-6 w-full"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          
          <motion.div 
            className="relative rounded-2xl overflow-hidden h-[400px] shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={laptopImage}
              alt="Lost & Found"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>

          <motion.div 
            className="p-8 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-white/40 text-center shadow-lg"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🔍 Welcome Back!
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sign in to access your account and manage your lost items. Search for your lost belongings, report new items, and connect with our community.
            </p>
            <p className="text-gray-600 text-sm italic">
              "Our platform helps you quickly retrieve your valuable possessions."
            </p>
          </motion.div>

        </motion.div>

        <motion.div 
          className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/50"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-8 text-center">
            <motion.h2 
              className="text-4xl font-bold text-green-600 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Welcome Back
            </motion.h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {error && (
            <motion.div 
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-5 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-xl">⚠️</span> {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-5 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-xl">✅</span> {success}
            </motion.div>
          )}

          <motion.form onSubmit={handleSubmit} variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-4 text-gray-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  placeholder="yourname@iic.edu.np"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>

            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-4 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition text-lg"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>

            <motion.div className="mt-6 space-y-3" variants={itemVariants}>
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/" className="text-green-600 font-bold hover:underline">
                  Create one now
                </a>
              </p>

              <p className="text-center">
                <button 
                  type="button"
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold hover:underline transition"
                >
                  Forgot Password?
                </button>
              </p>
            </motion.div>
          </motion.form>

          <motion.div 
            className="mt-8 pt-6 border-t border-gray-200"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-gray-500 text-center">
              Your data is secure and encrypted
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
    </>
  );
}
