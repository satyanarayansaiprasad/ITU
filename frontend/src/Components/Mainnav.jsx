import { Home, Menu, X, MoreHorizontal, Shield, Info, Phone, Activity, Newspaper, Image, Users, User, Lock, UserCog, UserPlus } from "lucide-react";
import React, { useState } from "react";
  import { Link } from "react-router-dom"; // Make sure this import is at the top
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Added for navigation

export default function Mainnav() {
  const navigate = useNavigate(); // Initialize navigate
  const [isOpen, setIsOpen] = useState(false);
  const [othersOpen, setOthersOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginType, setLoginType] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close mobile menu if open
  };

  const menuItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: -20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <motion.header 
        className="sticky top-0 left-0 w-full h-auto z-50 bg-[#0B2545]/95 backdrop-blur-md shadow-lg border-b border-white/10"
        initial="hidden"
        animate="visible"
      >
        <div className="container-responsive">
          <div className="flex items-center justify-between py-3 sm:py-4">
            
            {/* Logo Section - Enhanced */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer touch-friendly"
              onClick={() => handleNavigation("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-green-400 rounded-full opacity-20 blur"></div>
                <img
                  src="/ITU LOGO.png"
                  alt="Indian Taekwondo Union Logo"
                  className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full object-cover border-2 border-white/20"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-base md:text-lg leading-tight">
                  Indian Taekwondo
                </h1>
                <p className="text-white text-base md:text-lg font-bold">Union</p>
              </div>
            </motion.div>

            {/* Desktop Navigation - Enhanced */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {[
                { icon: <Home size={20} />, title: "HOME", path: "/", desc: "Welcome" },
                { icon: <Info size={20} />, title: "ABOUT", path: "/about", desc: "Learn More", hasDropdown: true },
                { icon: <Shield size={20} />, title: "STATE UNION", path: "/state-union", desc: "Regional" },
                { icon: <Phone size={20} />, title: "CONTACT", path: "/contact", desc: "Get in Touch" },
                { icon: <Activity size={20} />, title: "SELF DEFENCE", path: "/self-defence", desc: "Protection Skills" },
                { icon: <MoreHorizontal size={20} />, title: "MORE", path: "#", desc: "Others", hasDropdown: true }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="relative group"
                  onMouseEnter={() => {
                    if (item.title === "ABOUT") setAboutOpen(true);
                    if (item.title === "MORE") setOthersOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (item.title === "ABOUT") setAboutOpen(false);
                    if (item.title === "MORE") setOthersOpen(false);
                  }}
                >
                  <motion.div 
                    className="flex flex-col items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-white/10 transition-all duration-300"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !item.hasDropdown && handleNavigation(item.path)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-white group-hover:text-orange-300 transition-colors">
                        {item.icon}
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors leading-tight">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-orange-200 transition-colors">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Dropdown Menus */}
                  {item.title === "ABOUT" && (
                    <AnimatePresence>
                      {aboutOpen && (
                        <motion.div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 w-56 bg-white/95 backdrop-blur-md shadow-xl rounded-xl py-3 mt-2 border border-white/20 z-[60]"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          {[
                            { title: "Union Of Directors", path: "/about/directors" },
                            { title: "Referee & Instructors", path: "/about/referees" }
                          ].map((subItem, subIndex) => (
                            <motion.div 
                              key={subIndex}
                              className="px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-orange-400 touch-friendly relative z-[70]"
                              whileHover={{ x: 4 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAboutOpen(false);
                                handleNavigation(subItem.path);
                              }}
                            >
                              {subItem.title}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                  
                  {item.title === "MORE" && (
                    <AnimatePresence>
                      {othersOpen && (
                        <motion.div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 w-48 bg-white/95 backdrop-blur-md shadow-xl rounded-xl py-3 mt-2 border border-white/20 z-[60]"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          {[
                            { icon: <Newspaper size={16} />, title: "News", path: "/news" },
                            { icon: <Image size={16} />, title: "Gallery", path: "/gallery" },
                            { icon: <Users size={16} />, title: "Players", path: "/players" },
                            { icon: <User size={16} />, title: "Forms", path: "/forms" }
                          ].map((subItem, subIndex) => (
                            <motion.div 
                              key={subIndex}
                              className="px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors flex items-center gap-3 touch-friendly relative z-[70]"
                              whileHover={{ x: 4 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOthersOpen(false);
                                handleNavigation(subItem.path);
                              }}
                            >
                              <div className="text-orange-500">{subItem.icon}</div>
                              {subItem.title}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
              
              {/* Enhanced Login Button */}
              <Link to="/login">
                <motion.button 
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-bold text-base hover:shadow-lg transition-all duration-300 flex items-center gap-2 focus-custom"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Lock size={18} />
                  <span>Login</span>
                </motion.button>
              </Link>
            </nav>

            {/* Mobile Menu Button - Enhanced */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors touch-friendly focus-custom"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </button>
          </div>
        </div>

      </motion.header>

      {/* Login Modal */}
      {/* <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-10 backdrop-blur-sm">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="p-8">
                {!loginType ? (
                  <>
                    <div className="text-center mb-8">
                      <Lock size={48} className="mx-auto text-[#0B2545] mb-4" />
                      <h2 className="text-3xl font-bold text-[#0B2545]">Welcome Back</h2>
                      <p className="text-gray-500 mt-2">Please select your login type</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <motion.button
                        onClick={() => setLoginType('admin')}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0B2545] to-[#13315C] text-white rounded-lg hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserCog size={24} />
                        <span className="font-medium">Admin Login</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setLoginType('associate')}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0B2545] to-[#13315C] text-white rounded-lg hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserPlus size={24} />
                        <span className="font-medium">Associate Login</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setLoginType('player')}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0B2545] to-[#13315C] text-white rounded-lg hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Users size={24} />
                        <span className="font-medium">Player Login</span>
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="mx-auto mb-4 flex items-center justify-center">
                        {loginType === 'admin' && <UserCog size={48} className="text-[#0B2545]" />}
                        {loginType === 'associate' && <UserPlus size={48} className="text-[#0B2545]" />}
                        {loginType === 'player' && <Users size={48} className="text-[#0B2545]" />}
                      </div>
                      <h2 className="text-3xl font-bold text-[#0B2545]">
                        {loginType === 'admin' && 'Admin Login'}
                        {loginType === 'associate' && 'Associate Login'}
                        {loginType === 'player' && 'Player Login'}
                      </h2>
                    </div>
                    
                    <form className="space-y-5">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-all"
                          placeholder={`Enter your ${loginType} username`}
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-all"
                          placeholder="Enter your password"
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 text-[#0B2545] focus:ring-[#0B2545] border-gray-300 rounded"
                          />
                          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                            Remember me
                          </label>
                        </div>
                        
                        <a href="#" className="text-sm text-[#0B2545] hover:underline font-medium">
                          Forgot password?
                        </a>
                      </motion.div>
                      
                      <motion.button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#0B2545] to-[#13315C] text-white font-medium rounded-lg hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Login
                      </motion.button>
                    </form>
                    
                    <motion.button
                      onClick={() => setLoginType(null)}
                      className="mt-6 w-full py-2 px-4 border border-[#0B2545] text-[#0B2545] font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      whileHover={{ y: -2 }}
                    >
                      <X size={18} />
                      <span>Back to login options</span>
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[#0B2545]/98 backdrop-blur-md z-40 flex flex-col safe-area-padding"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src="/ITU LOGO.png"
                  alt="ITU Logo"
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h2 className="text-white font-bold text-lg">ITU</h2>
                  <p className="text-orange-300 text-sm">Navigation Menu</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors touch-friendly"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <nav className="space-y-2">
                {[
                  { icon: <Home size={22} />, title: "Home", path: "/", desc: "Welcome to ITU" },
                  { icon: <Info size={22} />, title: "About", path: "/about", desc: "Learn about us" },
                  { icon: <Shield size={22} />, title: "State Union", path: "/state-union", desc: "Regional offices" },
                  { icon: <Phone size={22} />, title: "Contact", path: "/contact", desc: "Get in touch" },
                  { icon: <Activity size={22} />, title: "Self Defence", path: "/self-defence", desc: "Protection & martial arts" },
                  { icon: <Newspaper size={22} />, title: "Blog", path: "/news", desc: "Latest articles & insights" },
                  { icon: <Image size={22} />, title: "Gallery", path: "/gallery", desc: "Photo gallery" },
                  { icon: <Users size={22} />, title: "Players", path: "/players", desc: "Our athletes" },
                  { icon: <User size={22} />, title: "Forms", path: "/forms", desc: "Registration forms" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="group"
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    custom={index}
                  >
                    <div
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 cursor-pointer transition-all duration-300 touch-friendly"
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                        <div className="text-white group-hover:text-orange-300 transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg group-hover:text-orange-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm group-hover:text-orange-200 transition-colors">
                          {item.desc}
                        </p>
                      </div>
                      <div className="text-white/50 group-hover:text-orange-300 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-6 border-t border-white/10">
              <Link to="/login">
                <motion.button
                  className="w-full btn-responsive bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold justify-center"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Lock size={20} />
                    <span>Login to Account</span>
                  </div>
                </motion.button>
              </Link>
              
              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-gray-400 text-sm">Follow us:</div>
                <div className="flex gap-3">
                  {[
                    { icon: "📘", label: "Facebook" },
                    { icon: "📷", label: "Instagram" },
                    { icon: "🐦", label: "Twitter" },
                    { icon: "📺", label: "YouTube" }
                  ].map((social, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label={social.label}
                    >
                      <span className="text-sm">{social.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}