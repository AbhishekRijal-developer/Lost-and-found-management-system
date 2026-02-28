import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineSearch, HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/home" },
    { label: "Lost Items", path: "/lost-items" },
    { label: "Found Items", path: "/found-items" },
    { label: "About", path: "/about-us" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            onClick={() => navigate("/home")}
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              🔍 Lost & Found
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`font-semibold transition ${
                  isActive(link.path)
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
              whileHover={{ scale: 1.05 }}
            >
              <HiOutlineUser className="text-xl" /> Profile
            </motion.button>
            <motion.button
              onClick={() => {
                alert("Logged out!");
                navigate("/login");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              whileHover={{ scale: 1.05 }}
            >
              <HiOutlineLogout className="text-xl" /> Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-purple-600 text-2xl"
              whileHover={{ scale: 1.1 }}
            >
              {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 pb-4 space-y-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {navLinks.map((link) => (
              <motion.button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-semibold transition ${
                  isActive(link.path)
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              onClick={() => {
                navigate("/profile");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-purple-600 hover:bg-purple-50 transition"
            >
              👤 Profile
            </motion.button>
            <motion.button
              onClick={() => {
                alert("Logged out!");
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition"
            >
              🚪 Logout
            </motion.button>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
