import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, Users, Award, Clock, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SelfDefence = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider images
  const sliderImages = [
    '/kick1.jpg',
    '/kick1.jpg',
    '/kick1.jpg',
    '/kick1.jpg'
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    arrows: true,
    fade: true,
    cssEase: "linear",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
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

  const techniques = [
    {
      title: "Basic Self Defense",
      description: "Learn fundamental techniques to protect yourself in dangerous situations",
      icon: <Shield size={32} />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500"
    },
    {
      title: "Combat Techniques",
      description: "Advanced martial arts moves for effective self-protection",
      icon: <Zap size={32} />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-500"
    },
    {
      title: "Precision Training",
      description: "Target-focused training to improve accuracy and effectiveness",
      icon: <Target size={32} />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500"
    },
    {
      title: "Group Classes",
      description: "Learn with others in a supportive and motivating environment",
      icon: <Users size={32} />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500"
    }
  ];

  const programs = [
    {
      name: "Women's Self Defence",
      duration: "4 weeks",
      level: "Beginner",
      description: "Specialized program designed for women's safety and empowerment",
      features: ["Basic strikes", "Escape techniques", "Situational awareness", "Confidence building"]
    },
    {
      name: "Youth Protection",
      duration: "6 weeks",
      level: "Beginner to Intermediate",
      description: "Teaching young people essential self-defense skills",
      features: ["Anti-bullying techniques", "Stranger danger", "Basic martial arts", "Mental strength"]
    },
    {
      name: "Advanced Combat",
      duration: "8 weeks",
      level: "Advanced",
      description: "Intensive training for serious practitioners",
      features: ["Advanced techniques", "Weapon defense", "Multiple attackers", "Competition prep"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12">
      
      {/* Hero Slider Section */}
      <div className="relative mb-16">
        <div className="relative h-[500px] overflow-hidden rounded-2xl shadow-2xl">
          <Slider {...sliderSettings}>
            {sliderImages.map((image, index) => (
              <div key={index} className="relative h-[500px]">
                <img 
                  src={image} 
                  alt={`Self Defence Training ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent">
                  <div className="container-responsive h-full flex items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-white max-w-2xl"
                    >
                      <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold text-sm mb-6 border border-white/30">
                        <Shield className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        SELF DEFENCE TRAINING
                      </div>
                      <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Master the Art of{' '}
                        <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                          Self Defence
                        </span>
                      </h1>
                      <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                        Learn practical self-defense techniques rooted in traditional Taekwondo principles. 
                        Build confidence, improve fitness, and master essential protection skills for real-world situations.
                      </p>
                      <div className="flex gap-4">
                        <motion.button
                          className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <Shield size={20} />
                            <span>Start Training Today</span>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <Phone size={20} />
                            <span>Contact Instructor</span>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <div className="container-responsive">
        {/* Techniques Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Core Self Defence Techniques
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Master these essential techniques to protect yourself and build confidence in any situation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techniques.map((technique, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:shadow-2xl group cursor-pointer transition-all duration-300"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${technique.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`text-transparent bg-gradient-to-r ${technique.color} bg-clip-text`}>
                      {technique.icon}
                    </div>
                  </div>
                  
                  <h3 className="2xl font-bold text-white mb-3">
                    {technique.title}
                  </h3>
                  
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {technique.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Programs Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Self Defence Programs
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Choose from our specialized programs designed for different skill levels and age groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:shadow-2xl group transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {program.name}
                    </h3>
                    <span className="px-3 py-1 bg-red-500/30 backdrop-blur-sm text-white border border-white/30 rounded-full text-xs font-semibold">
                      {program.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{program.duration}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="font-semibold text-white text-sm">What You'll Learn:</h4>
                  <ul className="space-y-1">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Award size={18} />
                    <span>Enroll Now</span>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          className="bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose ITU Self Defence?
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Our self-defense programs combine traditional Taekwondo techniques with modern protection strategies, 
              taught by certified instructors with years of experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🥋", title: "Expert Instructors", desc: "Certified Taekwondo masters" },
              { icon: "🏆", title: "Proven Methods", desc: "Time-tested techniques" },
              { icon: "👥", title: "All Ages Welcome", desc: "Programs for everyone" },
              { icon: "🎯", title: "Real-World Focus", desc: "Practical applications" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-xl mb-2">{benefit.title}</h3>
                <p className="text-sm opacity-90">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8 pt-8 border-t border-white/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg mb-6">Ready to start your self-defense journey?</p>
            <motion.button
              className="bg-white text-red-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-3">
                <Award size={20} />
                <span>Find Classes Near You</span>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Your Self Defence Training Today
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have learned to protect themselves through our proven self-defense programs. 
              Contact us to schedule your first class or learn more about our training methods.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Phone size={18} />
                  <span>Get Started</span>
                </div>
              </motion.a>
              
              <motion.a
                href="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Shield size={18} />
                  <span>Learn More</span>
                </div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SelfDefence;
