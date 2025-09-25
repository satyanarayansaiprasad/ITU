import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Image,
  Info,
  Mail,
  Camera,
  Newspaper,
  GalleryVerticalEnd,
  FilePlus,
  UserRound,
  Shield,
  Sword,
  Medal,
  Trophy,
  Users,
  Footprints,
  Flag,
} from "lucide-react";

const cardData = [
  {
    title: "Homepage Slider Management",
    icon: <Image className="w-8 h-8 text-blue-500" />,
    description: "Upload slider images for homepage display.",
    link: "/admin/slider-management",
  },
  {
    title: "State Taekwondo Unions",
    icon: <Info className="w-8 h-8 text-purple-500" />,
    description: "Add and manage state unions.",
    link: "/admin/state-unions",
  },
  {
    title: "Contact Submissions",
    icon: <Mail className="w-8 h-8 text-red-500" />,
    description: "View all contact form submissions.",
    link: "/admin/view-contacts",
  },
  {
    title: "Self-Defence Gallery",
    icon: <Camera className="w-8 h-8 text-yellow-500" />,
    description: "Upload and manage self-defence images.",
    link: "/admin/self-defence-gallery",
  },
  {
    title: "Blog Management",
    icon: <Newspaper className="w-8 h-8 text-orange-500" />,
    description: "Create and manage blog posts.",
    link: "/admin/blogs",
  },
  {
    title: "Gallery Management",
    icon: <GalleryVerticalEnd className="w-8 h-8 text-pink-500" />,
    description: "Upload and manage gallery images.",
    link: "/admin/gallery",
  },
  {
    title: "Form Submissions",
    icon: <FilePlus className="w-8 h-8 text-green-500" />,
    description: "View submitted forms from users.",
    link: "/admin/form-submissions",
  },
];

const AdminDash = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#e7efff] via-[#e1ecf8] to-[#dce7ff] p-6 overflow-hidden font-sans">
      {/* 🟡 Background Lucide Sticker Icons */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Animated Pulse Icons */}
        <Medal className="absolute top-3 right-30 w-32 h-32 text-yellow-300 opacity-10 animate-pulse" />
        <Sword className="absolute bottom-10 left-20 w-36 h-36 text-red-400 opacity-10 rotate-45 animate-pulse" />
        {/* Static Icons with depth */}
        <Shield className="absolute top-1/3 right-12 w-28 h-28 text-purple-400 opacity-10 rotate-6 blur-sm" />
        <UserRound className="absolute top-1/4 left-[45%] w-24 h-24 text-blue-300 opacity-10 rotate-12" />
        <Trophy className="absolute bottom-20 right-10 w-32 h-32 text-amber-400 opacity-10 -rotate-6" />
        <Users className="absolute top-[60%] left-10 w-28 h-28 text-indigo-300 opacity-10 -rotate-[20deg]" />
        <Footprints className="absolute top-[75%] right-[40%] w-24 h-24 text-gray-400 opacity-10 rotate-[15deg]" />
        <Flag className="absolute bottom-5 left-[55%] w-20 h-20 text-blue-500 opacity-10 rotate-12 blur-sm" />
      </div>

      {/* 🔵 Header */}
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-4xl font-extrabold text-[#142947] drop-shadow-md">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-lg mt-2 font-medium text-gray-700 italic">
          “Punch with purpose, code with power – Taekwondo meets tech.”
        </p>
        <div className="w-40 h-1 mx-auto mt-4 bg-gradient-to-r from-red-600 via-black to-blue-600 rounded-full"></div>
      </div>

      {/* 🟢 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {cardData.map((card, index) => (
          <Link to={card.link} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-t-4 border-b-4 border-transparent hover:border-blue-500"
            >
              <div className="flex items-center space-x-4">
                {card.icon}
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDash;
