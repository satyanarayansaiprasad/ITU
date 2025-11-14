import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import axios from "axios";
import { API_ENDPOINTS, GET_UPLOAD_URL } from "../config/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const textContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.3, duration: 0.8, ease: "easeOut" },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Home = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_SLIDER);
      setSliderImages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch sliders:", err);
    }
  };

  const getImageUrl = (filename) => {
    if (!filename) return "/default-image.png";
    if (/^(https?|data):/i.test(filename)) return filename;
    return GET_UPLOAD_URL(filename);
  };

  const handleImageError = (id) => {
    setImageLoadErrors((prev) => ({ ...prev, [id]: true }));
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
    cssEase: "linear",
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: true,
        }
      }
    ]
  };

  return (
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden safe-area-padding pt-[5px] sm:pt-[15px] md:pt-[18px] pb-4 sm:pb-8">
        {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/flag.webm" type="video/mp4" />
        {/* Fallback for browsers that don't support the video */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2658] to-[#05183d]"></div>
      </video>

      {/* Enhanced Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0f2658]/95 via-[#1a365d]/90 to-[#05183d]/95"></div>

      {/* Main Content Container */}
      <div className="relative z-10 container-responsive flex flex-col items-center justify-center min-h-screen py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          
          {/* Left Section - Enhanced Typography */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 text-white text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-4 sm:mb-6"
              variants={textVariants}
            >
              <span className="text-responsive-sm text-orange-300 font-medium">
                🥋 Official Taekwondo Union
              </span>
            </motion.div>
            
            <motion.h1
              className="text-responsive-2xl font-bold mb-4 sm:mb-6 leading-tight"
              variants={textVariants}
            >
              <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 bg-clip-text text-transparent">
                Welcome to
              </span>
              <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 bg-clip-text text-transparent mt-2">
                Indian Taekwondo Union
              </span>
              <span className="block text-lg sm:text-xl text-white/90 mt-2 font-normal">
                Official ITU
              </span>
            </motion.h1>
            
            <motion.p
              className="text-responsive-base text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
              variants={textVariants}
            >
              Learn Taekwondo martial arts with India's premier organization. Join 50,000+ students, train with 500+ certified instructors across 25+ states nationwide.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={textVariants}
            >
              <motion.button
                className="btn-responsive bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl focus-custom"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  🥋 Learn More
                </span>
              </motion.button>
              
              <motion.button
                className="btn-responsive bg-white/10 backdrop-blur-md text-white border border-white/20 font-semibold hover:bg-white/20 focus-custom"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  📹 Watch Video
                </span>
              </motion.button>
            </motion.div>
            
            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-8 border-t border-white/20"
              variants={textVariants}
            >
              <div className="text-center lg:text-left">
                <div className="text-responsive-lg font-bold text-orange-300">50K+</div>
                <div className="text-responsive-xs text-gray-300">Students</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-responsive-lg font-bold text-green-300">500+</div>
                <div className="text-responsive-xs text-gray-300">Instructors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-responsive-lg font-bold text-yellow-300">25+</div>
                <div className="text-responsive-xs text-gray-300">States</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Premium Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 order-1 lg:order-2 max-w-full sm:max-w-lg lg:max-w-none px-2 sm:px-0"
          >
            <div className="relative">
              {/* Multiple Decorative backgrounds for depth */}
              <div className="absolute -inset-2 sm:-inset-6 bg-gradient-to-r from-orange-500/30 to-green-500/30 rounded-3xl blur-2xl animate-pulse-soft"></div>
              <div className="absolute -inset-1 sm:-inset-3 bg-gradient-to-r from-orange-400/20 to-green-400/20 rounded-2xl blur-xl"></div>
              
              <div className="relative glass-effect rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/30 shadow-2xl">
                {sliderImages.length > 0 ? (
                  <div className="relative">
                    <Slider {...sliderSettings}>
                      {sliderImages.map((slider, index) => {
                        const imageUrl = getImageUrl(slider.filename);
                        const hasError = imageLoadErrors[slider._id];
                        return (
                          <div key={slider._id || index} className="relative group">
                            <div className="aspect-video overflow-hidden rounded-lg sm:rounded-xl shadow-lg">
                              <img
                                src={hasError ? "/default-image.png" : imageUrl}
                                alt={`Indian Taekwondo Union Training Session ${index + 1} - Professional Martial Arts Training in India`}
                                onError={() => handleImageError(slider._id)}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                loading="lazy"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                              />
                              {/* Subtle overlay for better text contrast */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                              
                              {/* Image indicators */}
                              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                                <span className="text-white text-xs font-medium">
                                  {index + 1} / {sliderImages.length}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                    
                    {/* Custom slider dots */}
                    <div className="flex justify-center mt-4 gap-2">
                      {sliderImages.map((_, index) => (
                        <div
                          key={index}
                          className="w-2 h-2 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300"
                        ></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-600 px-4">
                      <motion.div 
                        className="text-3xl sm:text-5xl mb-3"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        🥋
                      </motion.div>
                      <div className="text-xs sm:text-sm font-medium">Loading Training Images...</div>
                      <div className="text-xs text-gray-500 mt-1">Please wait</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on tablet and smaller devices */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden lg:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
