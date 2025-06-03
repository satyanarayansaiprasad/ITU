import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaYoutube } from 'react-icons/fa';
import { SiGooglemaps } from 'react-icons/si';
import { GiIndiaGate, GiTigerHead, GiLotus } from 'react-icons/gi';
import { BsFillChatSquareQuoteFill } from 'react-icons/bs';

// For GiPeacockFeather, we'll use an alternative since it might not be available
// Or you can install the specific package that contains it: npm install react-icons/gi

const Contact = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Taekwondo-inspired kick animation
  const kickAnimation = {
    rest: { rotate: 0, y: 0 },
    hover: {
      rotate: [0, 15, -15, 0],
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  // Indian flag color wave animation
  const flagWave = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse"
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Indian-Themed Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tricolor Icon with Lotus */}
        
          
          <motion.h1 
  className="text-3xl md:text-4xl font-serif text-gray-900 mb-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2 }}
>
  <span className="text-orange-500">Namaste 🙏</span>, <span className="text-green-600">Let's Connect</span>
</motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We're here to help and answer any questions you might have.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Indian-Themed Contact Form */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-sm border border-white/20 relative overflow-hidden"
            whileHover={{ y: -5 }}
          >
            {/* Indian-themed decorative elements */}
            <motion.div 
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-400/10"
              animate={{
                y: [0, 15, 0],
                x: [0, -10, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-green-600/10"
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            <motion.div 
              className="absolute top-4 left-4 text-orange-500 opacity-20"
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <GiTigerHead className="text-6xl" />
            </motion.div>
            
            <motion.h2 variants={item} className="text-2xl font-semibold text-gray-800 mb-8 relative z-10">
              <BsFillChatSquareQuoteFill className="inline-block mr-2 text-orange-500" />
              Send us a message
            </motion.h2>

            <motion.form variants={container} className="space-y-6 relative z-10">
              <motion.div variants={item} className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200/70 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="Enter your name"
                />
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200/70 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="your@email.com"
                />
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200/70 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="How can we help?"
                />
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200/70 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="Your message here..."
                ></textarea>
              </motion.div>

              <motion.div variants={item}>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-green-600 text-white font-medium py-3 px-6 rounded-xl hover:from-orange-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2"
                  whileHover={{ 
                    scale: 1.02,
                    background: ["linear-gradient(to right, #f97316, #16a34a)", "linear-gradient(to right, #ea580c, #15803d)"]
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPaperPlane className="text-xl" />
                  Send Message
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>

          {/* Contact Info Section with Indian Theme */}
          <div className="space-y-8">
            {/* Location Card with India Gate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-sm border border-white/20 relative overflow-hidden"
            >
              <motion.div 
                className="flex items-center gap-3 mb-6 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div 
                  className="p-3 rounded-lg bg-orange-500/10 text-orange-500"
                  variants={kickAnimation}
                >
                  <GiIndiaGate className="text-2xl" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-gray-800">Our Location</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden border border-gray-200/50 mb-4 relative z-10"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3693.041292961926!2d84.85326631535366!3d22.23248534949577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a201f5aaf7a7a3d%3A0x4d5a3a5a1b5a5a5a!2sCivil%20Township%2C%20Rourkela%2C%20Odisha%20769004!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-xl"
                ></iframe>
              </motion.div>

              <motion.div 
                className="p-4 bg-green-50/50 rounded-xl flex items-start gap-4 border border-green-100/50 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div 
                  className="p-2 rounded-full bg-orange-500/10 text-orange-500"
                  whileHover={{ rotate: 15 }}
                >
                  <FaMapMarkerAlt />
                </motion.div>
                <div>
                  <p className="font-medium text-gray-800">Head Office</p>
                  <p className="text-gray-600">HH-18, Civil Township</p>
                  <p className="text-gray-600">Rourkela, Odisha 769004</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Social Media Card with Indian Theme */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-sm border border-white/20 relative overflow-hidden"
            >
              <motion.h2 
                className="text-2xl font-semibold text-gray-800 mb-6 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <GiLotus className="inline-block mr-2 text-green-600" />
                Follow Us
              </motion.h2>
              <motion.p 
                className="text-gray-600 mb-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Stay updated with our latest news
              </motion.p>

              <motion.div className="flex justify-center gap-4 relative z-10">
  {[
    { 
      icon: <FaFacebook />, 
      color: 'bg-orange-500 hover:bg-orange-600',
      url: 'https://www.facebook.com/yourpage'
    },
    { 
      icon: <FaTwitter />, 
      color: 'bg-blue-400 hover:bg-blue-500',
      url: 'https://www.facebook.com/share/16Kxqfx9wp/'
    },
    { 
      icon: <FaInstagram />, 
      color: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600',
      url: 'https://www.instagram.com/indian_taekwondo_union_?igsh=MXgxejB3NDN6Y2Jhdw=='
    },
    { 
      icon: <FaYoutube />, 
      color: 'bg-red-500 hover:bg-red-600',
      url: 'https://youtube.com/@indiantaekwondounion6210?si=l3n62Z7QLTqYWR6m'
    }
  ].map((social, index) => (
    <motion.a
      key={index}
      href={social.url}
      target="_blank"  // Opens link in new tab
      rel="noopener noreferrer"  // Important for security with target="_blank"
      className={`${social.color} text-white p-4 rounded-full shadow-md transition-all`}
      whileHover={{ 
        y: -8,
        scale: 1.1,
        transition: { type: "spring", stiffness: 400 }
      }}
      whileTap={{ scale: 0.9 }}
    >
      {social.icon}
    </motion.a>
  ))}
</motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer with Indian theme */}
        <motion.div 
          className="mt-16 text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <div className="flex justify-center gap-2 mb-4">
            {/* <motion.div 
              className="w-8 h-1 bg-orange-500 rounded-full"
              animate={{ scaleX: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            /> */}
            {/* <motion.div 
              className="w-8 h-1 bg-white rounded-full"
              animate={{ scaleX: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            /> */}
            {/* <motion.div 
              className="w-8 h-1 bg-green-500 rounded-full"
              animate={{ scaleX: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            /> */}
          </div>
          <p>Made with ❤️ in India</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;