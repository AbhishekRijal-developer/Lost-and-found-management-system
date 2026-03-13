import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { authAPI } from '../services/api.js';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset link.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.resetPassword(token, password);
      if (response.success) {
        setSuccess(response.message || 'Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1800);
      }
    } catch (err) {
      setError(err.message || 'Could not reset password. The link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-100 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            className="bg-white/85 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="text-3xl font-bold text-green-700 text-center mb-2">Set New Password</h1>
            <p className="text-gray-600 text-center mb-8">
              Create a new password for your account.
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
                  New Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-4 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition text-lg"
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                  Confirm New Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-4 text-gray-400 text-lg" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition text-lg"
                  >
                    {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
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
