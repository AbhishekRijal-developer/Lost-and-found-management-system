import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { HiOutlineMail } from 'react-icons/hi';
import { authAPI } from '../services/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!email.endsWith('@iic.edu.np')) {
      setError('Email must end with @iic.edu.np');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        setSuccess(response.message || 'If an account exists with this email, a reset link has been sent.');
      }
    } catch (err) {
      setError(err.message || 'Unable to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            className="bg-white/85 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="text-3xl font-bold text-green-700 text-center mb-2">Forgot Password</h1>
            <p className="text-gray-600 text-center mb-8">
              Enter your account email and we will send you a secure reset link.
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-4 text-gray-400 text-lg" />
                  <input
                    type="email"
                    placeholder="yourname@iic.edu.np"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
              Remembered your password?{' '}
              <Link to="/login" className="text-cyan-700 font-semibold hover:underline">
                Back to Login
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
