import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import laptopImage from "../assets/laptop.png";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlinePhone } from "react-icons/hi";
import { authAPI } from "../services/api.js";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    if (!formData.email.endsWith("@iic.edu.np")) {
      setError("Email must end with @iic.edu.np (college email required)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
      });

      if (response.success) {
        setPendingEmail(response.email || formData.email.trim().toLowerCase());
        setShowOtpDialog(true);
        setSuccess("Registration started. Please enter the OTP sent to your college email.");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setVerifyingOtp(true);
      const response = await authAPI.verifyRegistrationOtp(pendingEmail, otp.trim());

      if (response.success) {
        setSuccess('Email verified successfully! Redirecting to login...');
        setShowOtpDialog(false);
        setOtp('');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');

    try {
      setResendingOtp(true);
      const response = await authAPI.resendRegistrationOtp(pendingEmail);

      if (response.success) {
        setSuccess('A new OTP has been sent to your email.');
      }
    } catch (err) {
      setError(err.message || 'Unable to resend OTP right now.');
    } finally {
      setResendingOtp(false);
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
          className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/50"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-8 text-center">
            <motion.h1 
              className="text-4xl font-bold text-green-600 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Create Account
            </motion.h1>
            <p className="text-gray-600">Join our community today</p>
          </div>

          {error && (
            <motion.div 
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-xl"></span> {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-xl"></span> {success}
            </motion.div>
          )}

          <motion.form onSubmit={handleSubmit} variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="mb-5" variants={itemVariants}>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="name"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 gap-4 mb-5" variants={itemVariants}>
              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Gender</label>
                <select
                  name="gender"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Phone</label>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                  <input
                    type="text"
                    name="phone"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                    placeholder="Your phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div className="mb-5" variants={itemVariants}>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">College Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                  placeholder="yourname@iic.edu.np"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 gap-4 mb-5" variants={itemVariants}>
              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                  <input
                    type="password"
                    name="password"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Confirm</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
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
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>

            <motion.p className="text-sm mt-6 text-center text-gray-600" variants={itemVariants}>
              Already registered?{" "}
              <a
                href="/login"
                className="text-green-600 font-bold hover:underline"
              >
                Sign in here
              </a>
            </motion.p>
          </motion.form>
        </motion.div>

        <motion.div
          className="flex flex-col gap-6 w-full"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <motion.div
            className="relative rounded-2xl overflow-hidden h-[350px] shadow-2xl"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </motion.div>

          <motion.div
            className="p-8 bg-gradient-to-br from-green-100/20 to-green-200/20 backdrop-blur-xl rounded-2xl border border-green-200/40 text-center shadow-lg"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Your Journey Starts Here
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Join thousands of users who've successfully reunited with their lost items. Our intelligent platform makes finding your belongings faster and easier than ever before. With just a few clicks, you'll be connected to a caring community dedicated to helping you recover what matters most.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {showOtpDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Verify your email</h3>
            <p className="text-sm text-gray-600 mb-5">
              Enter the 6-digit OTP sent to <span className="font-semibold">{pendingEmail}</span>
            </p>

            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white text-center tracking-[0.45em] text-xl font-semibold"
                placeholder="000000"
                required
              />

              <button
                type="submit"
                disabled={verifyingOtp}
                className="mt-4 w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyingOtp ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendingOtp}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {resendingOtp ? 'Resending...' : 'Resend OTP'}
              </button>

              <button
                type="button"
                onClick={() => setShowOtpDialog(false)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
    </>
  );
}
