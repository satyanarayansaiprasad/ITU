import React, { useState, useEffect } from "react";
import {
  Axe,
  ClipboardCheck,
  Facebook,
  Footprints,
  Instagram,
  Link,
  ShieldCheck,
  Sword,
  Twitter,
  Youtube,
} from "lucide-react";
import { GiBoxingGlove } from "react-icons/gi";
import { FaGooglePlay, FaApple } from "react-icons/fa";
const allStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli",
  "Daman & Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
];
const Footer = () => {
  const [visibleStates, setVisibleStates] = useState(allStates.slice(0, 6));
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 6) % allStates.length);
      setVisibleStates(allStates.slice(index, index + 6));
    }, 2000); // Change states every 3 seconds

    return () => clearInterval(interval);
  }, [index]);
  return (
    <footer className="relative">
      <div className="bg-[url('/footer2.jpg')] bg-blue-900 bg-opacity-90 bg-cover bg-center text-white py-10 px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center md:text-left">
          {/* Organization */}
          <div>
            <h3 className="text-green-400 font-semibold">Quick Links</h3>
            <ul className="mt-2 text-[#D2E3FB] font-semibold space-y-2">
              <li>About</li>
              <li>Guide</li>
              <li>FAQs</li>
              <li>Contact</li>
              <li>Query/Feedback</li>
            </ul>
          </div>

          {/* Approvals */}
          <div>
            <h3 className="text-green-400 font-semibold">Useful Links</h3>
            <ul className="mt-2 text-[#D2E3FB] font-semibold space-y-2">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Others */}
          <div>
            <h3 className="text-green-400 font-semibold">Visit Us</h3>
            <ul className="mt-2 text-[#D2E3FB] font-semibold space-y-2">
              <li>
                {" "}
                Address : 1st Floor, HH-18, Civil Township, Rourkela, Odisha
                769004
              </li>
            </ul>
          </div>

          {/* Contact Info (Full Width Below) */}
          <div className="col-span-3 sm:col-span-3 md:col-span-1 flex flex-col items-center md:items-start">
            <img
              src="/footerarrow.svg"
              alt="Call Icon"
              className="w-auto h-6 sm:h-8 md:h-10 mb-2 brightness-125 drop-shadow-lg"
            />
            <h3 className="text-green-400 font-semibold">Call us at</h3>
            <p className="text-xl  sm:text-2xl text-[#D2E3FB] font-bold">
              <a href="tel:+91 95839 21122">+91 95839 21122</a>
            </p>
            <p className="text-[#D2E3FB] font-semibold">
              [Mon - Sat, 9am - 6pm]
            </p>
          </div>

          {/* Social Media (Full Width Below) */}
          <div className="col-span-3 sm:col-span-3 md:col-span-1 flex flex-col items-center md:items-start">
            <div className="flex space-x-4 sm:space-x-6">
              <Facebook
                size={24}
                className="cursor-pointer hover:text-blue-400"
              />
              <Instagram
                size={24}
                className="cursor-pointer hover:text-pink-400"
              />
              <Twitter
                size={24}
                className="cursor-pointer hover:text-blue-300"
              />
              <Youtube
                size={24}
                className="cursor-pointer hover:text-red-500"
              />
            </div>
            <p className="text-sm font-semibold text-[#D2E3FB] mt-6 text-center md:text-left">
              Join the Taekwondo Tribe & Keep Up with the Latest!
            </p>
          </div>
        </div>

        {/* Ministries and States */}
        <div className="mt-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Ministries Section */}
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
  <div className="text-center md:text-left mb-4 md:mb-0">
    <h2 className="text-lg font-semibold">Download Our App</h2>
    <div className="flex justify-center md:justify-start mt-2">
      <a
        href="https://play.google.com/store"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        <FaGooglePlay className="mr-2" />
        <span>Google Play</span>
      </a>
    </div>
    {/* <p className="text-sm font-semibold text-gray-400 mt-2">
      Get our app for a better experience.
    </p> */}
  </div>
</div>

          {/* States Section */}
          <div>
  <h3 className="text-green-400  font-bold text-lg text-center md:text-left">
    States Units are{" "}
    <span className="text-[#D2E3FB]">live with Us</span>
  </h3>
  <div className="grid grid-cols-2  md:h-[200px]  h-[300px] md:grid-cols-3 gap-4 mt-5">
    {visibleStates.map((state, index) => (
      <div
        key={index}
        className="bg-[#11314F] opacity-70 p-4 rounded-lg flex items-center justify-center text-white h-20" // Added fixed height h-20
      >
        <p className="text-center">{state}</p> {/* Added text-center for better alignment */}
      </div>
    ))}
  </div>
</div>
        </div>
      </div>

      {/* Bottom Section */}
      {/* Bottom Section */}
      <div className="border-t border-gray-600 bg-[#0B2545] pt-4 pb-6">
        <p className="text-center text-sm text-gray-400">
          &copy; All Rights Reserved.{" "}
          <a
            href="https://websyonline.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-gray-300"
          >
            Design and Delivery by WebsyOnline
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
