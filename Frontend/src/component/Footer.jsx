import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-xl font-semibold mb-3">Lost & Found System</h2>
          <p className="text-gray-300">
            <h3>Helping users quickly report,</h3> 
            <h3>find, and return lost items easily.</h3>
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Report Lost Item</a></li>
            <li><a href="#" className="hover:text-white">Report Found Item</a></li>
            <li><a href="#" className="hover:text-white">All Items</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-gray-300">Email: support@lostandfound.com</p>
          <p className="text-gray-300">Phone: +9770000000000</p>
          <p className="text-gray-300">Location: Itahari International collage</p>
        </div>

      </div>

      <div className="text-center text-gray-400 mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} Lost & Found Management System — All Rights Reserved.
      </div>
    </footer>
  );
}
