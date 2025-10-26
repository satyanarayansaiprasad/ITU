import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, Users, Award, Clock, MapPin, Phone } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SelfDefence = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    '/kick1.jpg',
    '/kick1.jpg',
    '/kick1.jpg',
    '/kick1.jpg'
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    arrows: true,
    fade: true,
    cssEase: "ease-in-out",
    pauseOnHover: false,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange–50 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12">
      <div className="container-responsive">
        
        {/* Hero Slider Section */}
        <div className="relative mb-16 overflow-hidden rounded-3xl shadow-2xl">
          <div className="relative h-[450px]">
            <Slider {...sliderSettings}>
              {sliderImages.map((image, index) => (
                <div key={index} className="relative h-[450px]">
                  <img 
                    src={image} 
                    alt={`Taekwondo Self Defence Training ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent">
                    <div className="h-full flex items-center">
                      <div className="text-white max-w-2xl ml-8 sm:ml-16">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold text-sm mb-6 border border-white/30">
                          <Shield className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          SELF DEFENCE TRAINING
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                          Master the Art of{' '}
                          <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Self Defence
                          </span>
                        </h1>
                        <p className="text-lg text-white/90 mb-8 leading-relaxed pr-4">
                          Learn practical self-defense techniques rooted in traditional Taekwondo principles.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-center gap-3">
                              <Shield size={20} />
                              <span>Start Training Today</span>
                            </div>
                          </button>
                          <button className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/30 transition-all">
                            <div className="flex items-center gap-3">
                              <Phone size={20} />
                              <span>Contact Instructor</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-50 text-red-700 px-4 py-2 rounded-full font-semibold text-responsive-sm mb-6 border border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            SELF DEFENCE TRAINING
          </div>
          
          <h1 className="text-responsive-2xl font-bold text-gray-900 mb-6 leading-tight">
            Master the Art of{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
              Self Defence
            </span>
          </h1>
          
          <p className="text-responsive-base text-gray-600 max-w-3xl mx-auto mb-8">
            Learn practical self-defense techniques rooted in traditional Taekwondo principles. 
            Our comprehensive programs are designed to build confidence, improve fitness, and teach 
            essential protection skills for real-world situations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="btn-responsive bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-xl focus-custom"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-3">
                <Shield size={20} />
                <span>Start Training Today</span>
              </div>
            </motion.button>
            
            <motion.button
              className="btn-responsive border-2 border-red-500 text-red-600 font-bold hover:bg-red-500 hover:text-white focus-custom"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-3">
                <Phone size={20} />
                <span>Contact Instructor</span>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Techniques Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4">
              Core Self Defence Techniques
            </h2>
            <p className="text-responsive-base text-gray-600 max-w-2xl mx-auto">
              Master these essential techniques to protect yourself and build confidence in any situation.
            </p>
          </div>

          <div className="grid-responsive-1-2-4">
            {techniques.map((technique, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`card-responsive bg-white border-l-4 ${technique.borderColor} hover:shadow-xl group cursor-pointer`}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${technique.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`text-transparent bg-gradient-to-r ${technique.color} bg-clip-text`}>
                      {technique.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-responsive-base font-bold text-gray-900 mb-3">
                    {technique.title}
                  </h3>
                  
                  <p className="text-responsive-sm text-gray-600 leading-relaxed">
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
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4">
              Self Defence Programs
            </h2>
            <p className="text-responsive-base text-gray-600 max-w-2xl mx-auto">
              Choose from our specialized programs designed for different skill levels and age groups.
            </p>
          </div>

          <div className="grid-responsive-1-2-3">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                className="card-responsive bg-white border border-gray-200 hover:shadow-xl group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-responsive-lg font-bold text-gray-900">
                      {program.name}
                    </h3>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                      {program.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{program.duration}</span>
                    </div>
                  </div>
                  
                  <p className="text-responsive-sm text-gray-600 mb-4 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="font-semibold text-gray-900 text-sm">What You'll Learn:</h4>
                  <ul className="space-y-1">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  className="w-full btn-responsive bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold justify-center"
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
          className="bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-white text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-8">
            <h2 className="text-responsive-xl font-bold mb-4">
              Why Choose ITU Self Defence?
            </h2>
            <p className="text-responsive-base opacity-90 max-w-3xl mx-auto">
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
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm opacity-90">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8 pt-8 border-t border-white/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm opacity-80 mb-4">Ready to start your self-defense journey?</p>
            <motion.button
              className="btn-responsive bg-white text-red-600 font-bold hover:bg-gray-100 focus-custom"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-3">
                <MapPin size={18} />
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
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">
              Start Your Self Defence Training Today
            </h2>
            <p className="text-responsive-base text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of students who have learned to protect themselves through our proven self-defense programs. 
              Contact us to schedule your first class or learn more about our training methods.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="btn-responsive bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-xl focus-custom"
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
                className="btn-responsive border-2 border-red-500 text-red-600 font-bold hover:bg-red-500 hover:text-white focus-custom"
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
