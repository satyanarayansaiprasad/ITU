import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  Mail,
  Newspaper,
  GalleryVerticalEnd,
  FilePlus,
  Menu,
  X,
  ChevronRight,
  LogOut,
  MapPin,
  Crown,
  Shield,
  Type,
  User,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { clearAuthData } from "../../utils/auth";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { title: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/admindashboard" },
    { title: "Slider Management", icon: <Image className="w-5 h-5" />, path: "/admin/slider-management" },
    { title: "Self Defence Slider", icon: <Shield className="w-5 h-5" />, path: "/admin/self-defence-slider" },
    { title: "Category Slider", icon: <Type className="w-5 h-5" />, path: "/admin/category-slider" },
    { title: "Contact Submissions", icon: <Mail className="w-5 h-5" />, path: "/admin/view-contacts" },
    { title: "Blog Management", icon: <Newspaper className="w-5 h-5" />, path: "/admin/blogs" },
    { title: "Gallery Management", icon: <GalleryVerticalEnd className="w-5 h-5" />, path: "/admin/gallery" },
    { title: "Form Submissions", icon: <FilePlus className="w-5 h-5" />, path: "/admin/form-submissions" },
    { title: "States & Districts", icon: <MapPin className="w-5 h-5" />, path: "/admin/states-districts" },
    { title: "District & State Heads", icon: <Crown className="w-5 h-5" />, path: "/admin/heads-management" },
    { title: "Player Management", icon: <User className="w-5 h-5" />, path: "/admin/player-management" },
    { title: "Belt Promotion Tests", icon: <Award className="w-5 h-5" />, path: "/admin/belt-promotion" },
  ];

  const handleLogout = async () => {
    try {
      clearAuthData();
      
      // Call backend logout endpoint
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
        (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');
      
      try {
        await axios.get(`${API_BASE_URL}/api/admin/logout`, {
          withCredentials: true
        });
      } catch (err) {
        // Ignore logout errors
        console.log('Logout endpoint error (ignored):', err);
      }
      
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      clearAuthData();
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-[#0E2A4E] via-[#0E2A4E] to-white">
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed z-50 top-4 left-4 p-2 rounded-md bg-white shadow"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop Sidebar Toggle - Always visible when sidebar is closed */}
      {!sidebarOpen && (
        <button
          className="hidden md:block fixed z-50 top-4 left-4 p-2 rounded-md bg-[#0E2A4E] text-white shadow-lg hover:bg-[#193C69] transition-colors"
          onClick={() => setSidebarOpen(true)}
          title="Open Sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: -200, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -200, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed z-40 h-full w-64 left-0 text-white bg-gradient-to-b from-[#0E2A4E] to-[#193C69] shadow-lg md:hidden flex flex-col"
          >
            <div className="p-4 flex justify-between items-center border-b border-blue-900">
              <h1 className="text-xl font-bold text-white">Admin</h1>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 rounded hover:bg-blue-800">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-3 overflow-y-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg mb-2 transition-all duration-200
                    ${
                      location.pathname === item.path
                        ? "bg-white/10 shadow-md text-blue-200"
                        : "hover:bg-white/10 text-white"
                    } hover:scale-[1.03] hover:shadow-lg`}
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-blue-900">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Logout</span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible */}
      <aside
        className={`hidden md:flex fixed z-40 h-full text-white bg-gradient-to-b from-[#0E2A4E] to-[#193C69] shadow-lg transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"} flex-col`}
      >
        <div className="p-4 flex justify-between items-center border-b border-blue-900">
          {sidebarOpen && <h1 className="text-xl font-bold text-white">Admin</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-1 rounded hover:bg-blue-800 transition-colors"
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <ChevronRight
              className={`transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center p-3 rounded-lg mb-2 transition-all duration-200 group
                ${
                  location.pathname === item.path
                    ? "bg-white/10 shadow-md text-blue-200"
                    : "hover:bg-white/10 text-white"
                } hover:scale-[1.03] hover:shadow-lg`}
              title={!sidebarOpen ? item.title : ""}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-3">{item.title}</span>}
              {!sidebarOpen && (
                <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-900">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow group"
            title={!sidebarOpen ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
            {!sidebarOpen && (
              <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 
        ${sidebarOpen ? "md:ml-64" : "md:ml-20"} p-4 md:p-6`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-xl p-6 min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
