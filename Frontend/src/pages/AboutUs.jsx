import React from "react";
import { FiInstagram, FiLink } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io5";
import Footer from "../component/Footer";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen w-full 
                    bg-gradient-to-r from-[#f7c7d3] via-[#fdecd7] to-[#fff3d1] 
                    flex flex-col items-center p-6">

      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden">

        <h1 className="text-center text-3xl font-semibold py-10">About us</h1>

        <div className="bg-gradient-to-b from-white to-[#ffb3b3] pt-10 pb-20 px-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col items-center">
                <div className="w-44 h-44 bg-gray-300 rounded-full"></div>

                <div className="flex gap-4 mt-4">
                  <FiInstagram className="text-[#ff0069] text-3xl" />
                  <IoLogoWhatsapp className="text-green-600 text-3xl" />
                  <FiLink className="text-black text-3xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black text-white rounded-lg mx-auto my-10 px-10 py-8 w-[90%] sm:w-[80%] shadow-xl">
          <h2 className="text-center text-2xl font-semibold mb-4">Our mission</h2>
          <p className="text-center text-sm leading-relaxed">
            “Our mission is to create a reliable and efficient platform for reuniting lost items
            with their rightful owners. We aim to foster a supportive community where users can
            easily report, search, and recover lost belongings, enhancing trust and cooperation
            among individuals. By leveraging technology, we strive to reduce the time, effort, and
            stress associated with finding lost items, ensuring a seamless and satisfying
            experience for all our users.”
          </p>
        </div>
      </div>

      <div className="w-full mt-10">
        <Footer />
      </div>

    </div>
  );
}
