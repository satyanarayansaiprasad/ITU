import { Activity, Book, Medal, Play, Shield, Users, Phone } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BenefitsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 spacing-responsive-lg">
      <div className="container-responsive">
        <div className="flex-responsive-col-row items-start">
          
          {/* Left Side Content - Enhanced */}
          <div className="w-full lg:w-2/5 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-50 text-green-700 px-4 py-2 rounded-full font-semibold text-responsive-sm mb-6 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                SERVICES & PROGRAMS
              </div>
              
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-6 leading-tight">
                What We Offer in{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  Taekwondo
                </span>
              </h2>
              
              <p className="text-responsive-base text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                At ITU, we provide a comprehensive range of Taekwondo services to help you achieve your martial arts goals, whether you're a complete beginner or an advanced black belt practitioner.
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.a
                  href="https://youtube.com/@indiantaekwondounion6210?si=l3n62Z7QLTqYWR6m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-responsive bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl focus-custom"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Play className="w-5 h-5" />
                    <span>Subscribe to Channel</span>
                  </div>
                </motion.a>
                
                <motion.button
                  className="btn-responsive border-2 border-orange-500 text-orange-600 font-semibold hover:bg-orange-500 hover:text-white focus-custom"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/contact')}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span>Contact Us</span>
                  </div>
                </motion.button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center lg:text-left">
                  <div className="text-responsive-lg font-bold text-orange-600">1000+</div>
                  <div className="text-responsive-xs text-gray-500">Students Trained</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-responsive-lg font-bold text-green-600">50+</div>
                  <div className="text-responsive-xs text-gray-500">Programs</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-responsive-lg font-bold text-blue-600">15+</div>
                  <div className="text-responsive-xs text-gray-500">Years Experience</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side Benefit Boxes - Enhanced Grid */}
          <div className="w-full lg:w-3/5 mt-8 lg:mt-0">
            <div className="grid-responsive-1-2-3 lg:grid-cols-2">
              {[
                {
                  icon: <Activity size={28} />,
                  title: "Taekwondo Practice",
                  description: "Regular training sessions for all levels, from beginners to advanced practitioners.",
                  color: "from-blue-500 to-blue-600",
                  bgColor: "bg-blue-50",
                  borderColor: "border-blue-200"
                },
                {
                  icon: <Shield size={28} />,
                  title: "Kukkiwon Black Belt",
                  description: "Certification programs to achieve internationally recognized Kukkiwon black belts.",
                  color: "from-green-500 to-green-600",
                  bgColor: "bg-green-50",
                  borderColor: "border-green-200"
                },
                {
                  icon: <Users size={28} />,
                  title: "Self Defense",
                  description: "Specialized self-defense training programs for individuals and groups.",
                  color: "from-purple-500 to-purple-600",
                  bgColor: "bg-purple-50",
                  borderColor: "border-purple-200"
                },
                {
                  icon: <Medal size={28} />,
                  title: "State Championships",
                  description: "Hosting state-level Taekwondo championships to promote talent and competition.",
                  color: "from-orange-500 to-orange-600",
                  bgColor: "bg-orange-50",
                  borderColor: "border-orange-200"
                },
                {
                  icon: <Medal size={28} />,
                  title: "National Championships",
                  description: "National-level events bringing together the best athletes from across the country.",
                  color: "from-red-500 to-red-600",
                  bgColor: "bg-red-50",
                  borderColor: "border-red-200"
                },
                {
                  icon: <Book size={28} />,
                  title: "Referee Seminars",
                  description: "Training and certification programs for aspiring Taekwondo referees.",
                  color: "from-indigo-500 to-indigo-600",
                  bgColor: "bg-indigo-50",
                  borderColor: "border-indigo-200"
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`card-responsive bg-white border ${item.borderColor} hover:border-opacity-60 group cursor-pointer`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`text-transparent bg-gradient-to-r ${item.color} bg-clip-text`}>
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-responsive-base font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-responsive-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

            </div>
            
            {/* Enhanced Contact CTA */}
            <motion.div
              className="mt-8 p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl text-white text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                <div className="text-2xl mb-2">🥋</div>
                <h3 className="text-responsive-lg font-bold mb-2">
                  Ready to Start Your Journey?
                </h3>
                <p className="text-responsive-sm opacity-90 max-w-md mx-auto">
                  Connect with us for more information or to join our programs. We are here to help you achieve your Taekwondo goals.
                </p>
              </div>
              
              <motion.button
                onClick={() => navigate("/contact")}
                className="btn-responsive bg-white text-orange-600 font-semibold hover:bg-gray-100 focus-custom"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Phone size={18} />
                  <span>Get Started Today</span>
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;