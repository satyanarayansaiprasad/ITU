import { Home, Menu, X, MoreHorizontal, Shield, Info, Phone, Activity, Newspaper, Image, Users, User, Lock, UserCog, UserPlus } from "lucide-react";
import React, { useState } from "react";
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
        className="fixed top-0 left-0 w-full h-auto z-50 bg-[#0B2545] shadow-lg"
        initial="hidden"
        animate="visible"
      >
        <div className="flex w-full">
          {/* Left Section - Logo with Home navigation */}
          <div 
            className="w-[32%] md:w-[20%] flex items-center justify-center p-2 min-h-[70px] cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <motion.img
              src="/ITU LOGO.png"
              alt="SDDI Logo"
              className="h-auto w-auto max-w-[90px] max-h-[90px] sm:max-w-[100px] sm:max-h-[100px] md:max-w-[110px] md:max-h-[110px] rounded-full shadow-md object-cover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </div>

          {/* Right Section - Navigation */}
          <div className="w-[70%] md:w-[80%] flex relative items-center px-4 md:px-6 lg:px-12 py-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden text-gray-100 ml-auto"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={30} /> : <Menu size={30} />}
              </motion.div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-8 items-center w-full justify-center">
              {/* Home */}
              <motion.div 
                className="relative flex flex-col items-center cursor-pointer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/")}
              >
                <div className="flex items-center gap-2 transition duration-300">
                  <Home size={20} className="text-white" />
                  <div className="flex flex-col group">
                    <div className="text-sm font-semibold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                      HOME
                    </div>
                    <div className="text-xs py-1 text-gray-400 min-h-[16px]">Welcome to ITU</div>
                  </div>
                </div>
              </motion.div>

              {/* About with Dropdown */}
              <div 
                className="relative" 
                onMouseEnter={() => setAboutOpen(true)} 
                onMouseLeave={() => setAboutOpen(false)}
              >
                <motion.div 
                  className="relative flex flex-col items-center cursor-pointer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation("/about")}
                >
                  <div className="flex items-center gap-2 transition duration-300">
                    <Info size={20} className="text-white" />
                    <div className="flex flex-col group">
                      <div className="text-sm font-semibold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                        ABOUT
                      </div>
                      <div className="text-xs py-1 text-gray-400 min-h-[16px]">Learn about ITU</div>
                    </div>
                  </div>
                </motion.div>

                {/* About Dropdown Menu */}
                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      className="absolute top-12 left-1/2 transform -translate-x-1/2 w-48 bg-white shadow-lg rounded-md py-2 z-20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        whileHover={{ x: 5 }}
                        onClick={() => handleNavigation("/about/directors")}
                      >
                        Union Of Directors
                      </motion.div>
                      <motion.div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        whileHover={{ x: 5 }}
                        onClick={() => handleNavigation("/about/referees")}
                      >
                        Referee & Instructors Profile
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* State Taekwondo Union */}
              <motion.div 
                className="relative flex flex-col items-center cursor-pointer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/state-union")}
              >
                <div className="flex items-center gap-2 transition duration-300">
                  <Shield size={20} className="text-white" />
                  <div className="flex flex-col group">
                    <div className="text-sm font-semibold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                      STATE TAEKWONDO UNION
                    </div>
                    <div className="text-xs py-1 text-gray-400 min-h-[16px]">State-level representation</div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Us */}
              <motion.div 
                className="relative flex flex-col items-center cursor-pointer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/contact")}
              >
                <div className="flex items-center gap-2 transition duration-300">
                  <Phone size={20} className="text-white" />
                  <div className="flex flex-col group">
                    <div className="text-sm font-semibold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                      CONTACT US
                    </div>
                    <div className="text-xs py-1 text-gray-400 min-h-[16px]">Get in touch</div>
                  </div>
                </div>
              </motion.div>

              {/* Self Defence */}
              <motion.div 
                className="relative flex flex-col items-center cursor-pointer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/self-defence")}
              >
                <div className="flex items-center gap-2 transition duration-300">
                  <Activity size={20} className="text-white" />
                  <div className="flex flex-col group">
                    <div className="text-sm font-semibold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                      SELF DEFENCE
                    </div>
                    <div className="text-xs py-1 text-gray-400 min-h-[16px]">Training programs</div>
                  </div>
                </div>
              </motion.div>

              {/* OTHERS Section - Dropdown */}
              <motion.div
                className="relative flex items-center gap-2 cursor-pointer"
                onMouseEnter={() => setOthersOpen(true)}
                onMouseLeave={() => setOthersOpen(false)}
                whileHover={{ y: -2 }}
              >
                <MoreHorizontal size={20} className="text-white" />
                <div className="flex flex-col group">
                  <div className="text-sm font-semibold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                    OTHERS
                  </div>
                </div>

                <AnimatePresence>
                  {othersOpen && (
                    <motion.div
                      className="absolute top-8 left-0 w-40 bg-white shadow-lg rounded-md py-2 z-20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        whileHover={{ x: 5 }}
                        onClick={() => handleNavigation("/news")}
                      >Upcoming News</motion.div>
                      <motion.div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        whileHover={{ x: 5 }}
                        onClick={() => handleNavigation("/gallery")}
                      >Gallery</motion.div>
                      <motion.div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        whileHover={{ x: 5 }}
                        onClick={() => handleNavigation("/players")}
                      >Players</motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Login Button */}
              <motion.button 
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setLoginType(null);
                }}
                className="ml-2 px-3 py-2 bg-white text-[#0B2545] rounded font-medium text-xs hover:bg-gray-100 transition duration-300 flex items-center gap-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                <Lock size={14} />
                Login
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Login Modal */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Mobile Navigation - Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 mt-[50px] bg-[#0B2545] z-40 flex flex-col items-center justify-start pt-10 pb-10 px-4 h-[calc(100vh-30px)]"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-white"
              aria-label="Close menu"
            >
              <X size={30} />
            </button>

            {/* Mobile Menu Items */}
            <nav className="flex flex-col gap-4 w-full max-w-md mt-4">
              {[
                { icon: <Home size={20} />, title: "HOME", path: "/" },
                { icon: <Info size={20} />, title: "ABOUT", path: "/about" },
                { icon: <Shield size={20} />, title: "STATE TAEKWONDO UNION", path: "/state-union" },
                { icon: <Phone size={20} />, title: "CONTACT US", path: "/contact" },
                { icon: <Activity size={20} />, title: "SELF DEFENCE", path: "/self-defence" },
                { icon: <Newspaper size={20} />, title: "UPCOMING NEWS", path: "/news" },
                { icon: <Image size={20} />, title: "GALLERY", path: "/gallery" },
                { icon: <Users size={20} />, title: "PLAYERS", path: "/players" },
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#13315C] transition-colors"
                  variants={menuItemVariants}
                  custom={index}
                  onClick={() => handleNavigation(item.path)}
                >
                  <div className="text-white">
                    {item.icon}
                  </div>
                  <span className="text-white text-base font-medium">{item.title}</span>
                </motion.div>
              ))}

              {/* Mobile Login Button */}
              <motion.button 
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginModalOpen(true);
                  setLoginType(null);
                }}
                className="mt-6 px-5 py-2 bg-white text-[#0B2545] rounded-lg font-medium hover:bg-gray-100 transition duration-300 flex items-center justify-center gap-2"
                variants={menuItemVariants}
                custom={8}
              >
                <Lock size={18} />
                <span className="font-semibold">Login</span>
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add padding to content to account for fixed navbar */}
      <div className="pt-[90px]"></div>
    </>
  );
}