import React, { useState } from "react";
import laptopImage from "../assets/laptop.png";
import Footer from "../component/Footer";
export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    setError("");
    setSuccess("Registered successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <form onSubmit={handleSubmit}>

            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded mb-3"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label className="block font-medium">Gender</label>
            <select
              name="gender"
              className="w-full p-2 border rounded mb-3"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="w-full p-2 border rounded mb-3"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <label className="block font-medium">Email (College Email Required)</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded mb-3"
              placeholder="@iic.edu.np"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label className="block font-medium">Role</label>
            <select
              name="role"
              className="w-full p-2 border rounded mb-3"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>

            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded mb-3"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label className="block font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full p-2 border rounded mb-4"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Submit
            </button>

            <p className="text-sm mt-3 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline font-semibold">
                Sign in
              </a>
            </p>
          </form>
        </div>

<div className="flex flex-col gap-6 w-full">
  
  <div className="relative rounded-xl overflow-hidden h-[350px]">
    <img
      src={laptopImage}
      alt="Lost & Found"
      className="w-full h-full object-cover rounded-xl"
    />
  </div>

  <div className="p-6 bg-white/40 backdrop-blur-md rounded-xl border border-white/20 text-center max-w-2xl mx-auto">
    <h2 className="text-xl font-bold mb-2">
      Welcome to Our Lost and Found Website!
    </h2>
    <p className="text-sm">
      We're excited to help you find and recover lost items. Easily report lost 
      belongings, search for found items, and connect with others. Our user-friendly 
      platform aims to reunite you with your lost possessions quickly and efficiently.
      <br /><br />
      Thank you for choosing our service. If you need assistance, feel free to 
      contact us.
      <br /><br />
      Happy searching and best of luck!
    </p>
  </div>

</div>



      </div>
      <Footer />
    </div>
  );
}
