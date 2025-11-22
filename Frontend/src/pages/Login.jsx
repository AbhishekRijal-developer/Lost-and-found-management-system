import React, { useState } from "react";
import laptopImage from "../assets/laptop.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill all fields.");
      return;
    }

    if (!formData.email.endsWith("@iic.edu.np")) {
      setError("Email must end with @iic.edu.np");
      return;
    }

    setError("");
    setSuccess("Login successful!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">

        {/* LEFT IMAGE SECTION */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* Top Image */}
          <div className="relative rounded-xl overflow-hidden h-[350px]">
            <img
              src={laptopImage}
              alt="Lost & Found"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Welcome Box */}
          <div className="p-6 bg-white/40 backdrop-blur-md rounded-xl border border-white/20 text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2">
              Welcome to Our Lost and Found Website!
            </h2>
            <p className="text-sm">
              Sign in to access your account and manage lost items. Search for your 
              lost belongings, report new items, and connect with our community. 
              Our platform helps you quickly retrieve your valuable possessions.
              <br /><br />
              Welcome back! Let's find what you're looking for.
            </p>
          </div>

        </div>

        {/* RIGHT SECTION (Login Form) */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <form onSubmit={handleSubmit}>
            <label className="block font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded mb-3"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label className="block font-medium mb-2">Password</label>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                className="w-full p-2 border rounded"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-lg"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition mb-4"
            >
              Sign In
            </button>

            <p className="text-center text-sm">
              Don't have an account?{" "}
              <a href="/" className="text-blue-600 hover:underline font-semibold">
                Register here
              </a>
            </p>

            <p className="text-center text-sm mt-3 cursor-pointer hover:underline text-blue-600">
              Forgot Password?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
