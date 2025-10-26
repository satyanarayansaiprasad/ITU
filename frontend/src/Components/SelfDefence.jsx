import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, Users, Award, Clock, Phone, CheckCircle } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SelfDefence = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    '/kick1.jpg',
    '/c1.webp',
    '/c2.webp',
    '/c3.webp'
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    arrows: true,
    fade: true,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  };

  return (
    <div className="min-h-screen bg-white pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12">
      
      {/* Hero Slider Section */}
      <div className="relative mb-24 overflow-hidden">
        <div className="container-responsive">
          <div className="relative h-[600px] rounded-t-3xl overflow-hidden shadow-2xl">
            <Slider {...sliderSettings}>
              {sliderImages.map((image, index) => (
                <div key={index} className="relative h-[600px]">
                  <img 
                    src={image} 
                    alt={`Self Defence Training ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10">
                    <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                      <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-4 shadow-lg">
                          <Shield size={18} />
                          SELF DEFENCE TRAINING
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
                          Empower Yourself with{' '}
                          <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Taekwondo
                          </span>
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl">
                          Master essential self-defense skills taught by certified instructors. Build confidence, strength, and mental resilience.
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <motion.button
                            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Start Training Now
                          </motion.button>
                          <motion.button
                            className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Learn More
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      <div className="container-responsive">
        
        {/* Why Learn Self Defence Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">Why Learn Self Defence?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Build confidence, strength, and essential life skills through Taekwondo-based self-defense training.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={40} />, title: "Personal Safety", desc: "Protect yourself and loved ones in any situation", color: "from-blue-500 to-blue-600" },
              { icon: <Target size={40} />, title: "Mental Strength", desc: "Build confidence and mental resilience", color: "from-green-500 to-green-600" },
              { icon: <Zap size={40} />, title: "Physical Fitness", desc: "Improve agility, strength, and reflexes", color: "from-orange-500 to-red-600" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-400 transition-all shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <div className="text-white">{item.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Programs Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">Training Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the program that fits your needs and skill level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Women's Self Defence", duration: "4 weeks", level: "Beginner", price: "₹2,999", features: ["Basic strikes & blocks", "Escape techniques", "Situational awareness", "Confidence building"] },
              { name: "Youth Protection", duration: "6 weeks", level: "Intermediate", price: "₹3,999", features: ["Anti-bullying strategies", "Stranger danger prevention", "Basic sparring", "Mental toughness"] },
              { name: "Advanced Combat", duration: "8 weeks", level: "Advanced", price: "₹5,999", features: ["Advanced techniques", "Weapon defense", "Multiple attacker scenarios", "Competition preparation"] }
            ].map((program, index) => (
              <motion.div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, borderColor: "#fb923c" }}
              >
                <div className="text-center mb-6">
                  <span className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                    {program.level}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.name}</h3>
                  <div className="flex items-center justify-center gap-4 text-gray-600 mb-4">
                    <Clock size={16} />
                    <span>{program.duration}</span>
                  </div>
                  <div className="text-4xl font-black text-gray-900">{program.price}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {program.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enroll Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 rounded-3xl p-12 sm:p-16 mb-24 text-white">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">Benefits of ITU Self Defence</h2>
            <p className="text-xl opacity-90">Proven results from certified Taekwondo instructors</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🥋", title: "Expert Masters", desc: "Certified instructors" },
              { icon: "🏆", title: "Proven Methods", desc: "Time-tested techniques" },
              { icon: "👥", title: "All Ages", desc: "Everyone welcome" },
              { icon: "⚡", title: "Real Skills", desc: "Practical training" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-3xl p-12 border-2 border-gray-200">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students mastering self-defense. Contact us today to begin your journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.a
              href="/contact"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
            <motion.a
              href="/about"
              className="bg-white border-2 border-gray-300 text-gray-900 px-12 py-5 rounded-full font-bold text-lg hover:border-orange-400 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SelfDefence;
