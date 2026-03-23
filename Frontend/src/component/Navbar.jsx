import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineShieldCheck, HiOutlineChatAlt2, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import NotificationBell from "./NotificationBell.jsx";
import { chatAPI } from "../services/chatAPI.js";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const authOnlyPaths = ["/login", "/register", "/forgot-password"];
  const isAuthPage =
    authOnlyPaths.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password/");

  const navLinks = [
    { label: "Home", path: "/home" },
    { label: "Lost Items", path: "/lost-items" },
    { label: "Found Items", path: "/found-items" },
    { label: "About", path: "/about-us" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const [chatUnread, setChatUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUnread = async () => {
      try {
        const result = await chatAPI.getConversations(1, 50);
        if (result.success) {
          const total = (result.data || []).reduce((sum, c) => sum + (Number(c.unreadCount) || 0), 0);
          setChatUnread(total);
        }
      } catch (_) {}
    };

    fetchUnread();
    const id = window.setInterval(fetchUnread, 10000);
    window.addEventListener('focus', fetchUnread);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', fetchUnread);
    };
  }, [isAuthenticated]);

  return (
    <nav className="sticky top-0 z-50 border-b border-green-100 bg-white/90 backdrop-blur-xl shadow-[0_10px_26px_-18px_rgba(16,185,129,0.65)]">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            onClick={() => navigate("/home")}
            className="cursor-pointer flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <h1 className="text-2xl font-bold text-green-600 leading-none">
              Lost & Found
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          {!isAuthPage && isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-2 py-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`font-semibold px-4 py-2 rounded-full transition ${
                    isActive(link.path)
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-700 hover:text-green-600 hover:bg-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          )}

          {/* Right Actions */}
          {!isAuthPage && isAuthenticated && (
            <div className="hidden md:flex items-center gap-2">
              {user?.role === "Admin" && (
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => navigate("/admin-panel")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                      isActive("/admin-panel")
                        ? "bg-black text-white shadow-md"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <HiOutlineShieldCheck className="text-xl" /> Admin
                  </motion.button>
                  <motion.button
                    onClick={() => navigate("/admin-messages")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                      isActive("/admin-messages")
                        ? "bg-green-700 text-white shadow-md"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Messages
                  </motion.button>
                </div>
              )}
              <motion.button
                onClick={() => navigate("/chat")}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive("/chat")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "text-green-600 hover:bg-green-50"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <HiOutlineChatAlt2 className="text-xl" /> Chat
                {chatUnread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 shadow">
                    {chatUnread > 99 ? "99+" : chatUnread}
                  </span>
                )}
              </motion.button>
              <NotificationBell />
              {/* Dark mode toggle */}
              <motion.button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <HiOutlineSun className="text-xl" /> : <HiOutlineMoon className="text-xl" />}
              </motion.button>
              <motion.button
                onClick={() => navigate("/profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive("/profile")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "text-green-600 hover:bg-green-50"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <HiOutlineUser className="text-xl" /> Profile
              </motion.button>
              <motion.button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
              >
                <HiOutlineLogout className="text-xl" /> Logout
              </motion.button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAuthPage && isAuthenticated && (
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-green-600 text-2xl"
                whileHover={{ scale: 1.1 }}
              >
                {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {!isAuthPage && isAuthenticated && isMobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg space-y-2"
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
                    ? "bg-green-100 text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {link.label}
              </motion.button>
            ))}
            {user?.role === "Admin" && (
              <>
                <motion.button
                  onClick={() => {
                    navigate("/admin-panel");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition"
                >
                  Admin Panel
                </motion.button>
                <motion.button
                  onClick={() => {
                    navigate("/admin-messages");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition"
                >
                  Admin Messages
                </motion.button>
              </>
            )}
            <motion.button
              onClick={() => {
                navigate("/chat");
                setIsMobileMenuOpen(false);
              }}
              className="relative flex items-center gap-2 w-full text-left px-4 py-2 rounded-lg font-semibold text-green-600 hover:bg-green-50 transition"
            >
              Chat
              {chatUnread > 0 && (
                <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold px-1">
                  {chatUnread > 99 ? "99+" : chatUnread}
                </span>
              )}
            </motion.button>
            <NotificationBell mobile />
            {/* Dark mode toggle – mobile */}
            <motion.button
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
              {isDark ? <HiOutlineSun className="text-xl" /> : <HiOutlineMoon className="text-xl" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </motion.button>
            <motion.button
              onClick={() => {
                navigate("/profile");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-green-600 hover:bg-green-50 transition"
            >
              Profile
            </motion.button>
            <motion.button
              onClick={() => {
                logout();
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-green-600 hover:bg-green-50 transition"
            >
              Logout
            </motion.button>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
