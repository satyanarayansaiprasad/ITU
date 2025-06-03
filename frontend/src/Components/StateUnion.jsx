import React from 'react';
import { motion } from 'framer-motion';

const StateUnion = () => {
  const states = [
    { 
      id: 1, 
      name: 'Maharashtra', 
      secretary: 'Shri Rajesh Verma', 
      districts: 36, 
      champion: 'Master Rajesh Patil', 
      unionName: 'Maharashtra Taekwondo Union',
      established: 1995,
      headquarters: 'Mumbai',
      color: 'from-indigo-900 via-purple-900 to-violet-900',
      active: true
    },
    { 
      id: 2, 
      name: 'Delhi', 
      secretary: 'Shri Vikram Singh', 
      districts: 11, 
      champion: 'Master Vikram Singh', 
      unionName: 'Delhi Taekwondo Union',
      established: 1992,
      headquarters: 'New Delhi',
      color: 'from-amber-900 via-orange-900 to-red-900',
      active: true
    },
    { 
      id: 3, 
      name: 'Karnataka', 
      secretary: 'Shri Arjun Reddy', 
      districts: 30, 
      champion: 'Master Arjun Reddy', 
      unionName: 'Karnataka Taekwondo Union',
      established: 1998,
      headquarters: 'Bengaluru',
      color: 'from-emerald-900 via-teal-900 to-cyan-900',
      active: true
    },
    { 
      id: 4, 
      name: 'Tamil Nadu', 
      secretary: 'Shri Karthik Iyer',
      districts: 38, 
      champion: 'Master Karthik Iyer', 
      unionName: 'Tamil Nadu Taekwondo Union',
      established: 1996,
      headquarters: 'Chennai',
      color: 'from-blue-900 via-indigo-900 to-purple-900',
      active: true
    },
    { 
      id: 5, 
      name: 'Kerala', 
      secretary: 'Shri Ajith Nair', 
      districts: 14, 
      champion: 'Master Ajith Nair', 
      unionName: 'Kerala Taekwondo Union',
      established: 1994,
      headquarters: 'Kochi',
      color: 'from-green-900 via-emerald-900 to-teal-900',
      active: true
    },
    { 
      id: 6, 
      name: 'Gujarat', 
      secretary: 'Shri Jayesh Patel', 
      districts: 33, 
      champion: 'Master Jayesh Patel', 
      unionName: 'Gujarat Taekwondo Union',
      established: 2001,
      headquarters: 'Ahmedabad',
      color: 'from-rose-900 via-pink-900 to-fuchsia-900',
      active: true
    },
    { 
      id: 7, 
      name: 'Rajasthan', 
      active: false,
      color: 'from-yellow-900 via-amber-900 to-orange-900'
    },
    { 
      id: 8, 
      name: 'Punjab', 
      active: false,
      color: 'from-sky-900 via-blue-900 to-indigo-900'
    },
    { 
      id: 9, 
      name: 'West Bengal', 
      active: false,
      color: 'from-red-900 via-rose-900 to-pink-900'
    },
  ];

  // Enhanced animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4
      }
    }
  };

  const cardItem = {
    hidden: { y: 60, opacity: 0, scale: 0.95 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 0.7
      }
    }
  };

  const cardHover = {
    initial: { 
      y: 0,
      scale: 1,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      rotate: 0
    },
    hover: { 
      y: -12,
      scale: 1.03,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 200
      }
    }
  };

  const floating = {
    initial: { y: 0 },
    hover: {
      y: [0, -8, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const gradientWave = {
    initial: { backgroundPosition: '0% 50%' },
    hover: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const textReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  const pulse = {
    initial: { scale: 1 },
    hover: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 1.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="fixed inset-0 overflow-hidden pointer-events-none"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.05 + Math.random() * 0.1
              }}
              animate={{
                y: [0, (Math.random() > 0.5 ? 1 : -1) * 50, 0],
                x: [0, (Math.random() > 0.5 ? 1 : -1) * 50, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Animated Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl mb-6"
            variants={textReveal}
          >
            <motion.span className="inline-block">
              State <motion.span 
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >Unions</motion.span>
            </motion.span>
          </motion.h1>
          <motion.p 
            className="mt-5 max-w-2xl mx-auto text-xl text-gray-300 font-light"
            variants={textReveal}
          >
            Discover the network of Taekwondo unions across India, fostering martial arts excellence nationwide
          </motion.p>
        </motion.div>

        {/* States Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {states.map((state) => (
            <motion.div
              key={state.id}
              variants={cardItem}
              whileHover="hover"
              className="h-full"
            >
              {state.active ? (
                <motion.div
                  variants={cardHover}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden cursor-pointer h-full border border-gray-700/50 hover:border-amber-400/30 transition-all duration-300 group relative"
                >
                  {/* Gradient background with wave animation */}
                  <motion.div 
                    className={`h-64 w-full bg-gradient-to-r ${state.color} flex items-center justify-center relative overflow-hidden bg-[length:300%_300%]`}
                    variants={gradientWave}
                  >
                    <motion.span 
                      className="text-white text-4xl font-bold z-10 drop-shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      {state.name}
                    </motion.span>
                    <div className="absolute inset-0 bg-black/20" />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <motion.h3 
                        className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {state.unionName}
                      </motion.h3>
                      <motion.span 
                        className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-colors"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Est. {state.established}
                      </motion.span>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      {[
                        { label: 'Secretary', value: state.secretary, icon: '👤', delay: 0.3 },
                        { label: 'Districts', value: state.districts, icon: '🗺️', delay: 0.4 },
                        { label: 'Champion', value: state.champion, icon: '🏆', delay: 0.5 }
                      ].map((item, idx) => (
                        <motion.div 
                          key={idx}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: item.delay }}
                        >
                          <span className="text-gray-400 mr-2">{item.icon}</span>
                          <span className="text-gray-400 flex-1">{item.label}</span>
                          <span className="font-medium text-white text-right">{item.value}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.div 
                      className="mt-4 pt-4 border-t border-gray-700/50 flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.svg 
                        className="w-4 h-4 mr-2 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        variants={floating}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </motion.svg>
                      <span className="text-xs text-gray-400">{state.headquarters}</span>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  variants={cardHover}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden cursor-pointer h-full border-2 border-dashed border-gray-700/50 flex flex-col group"
                >
                  <motion.div 
                    className={`h-64 w-full bg-gradient-to-r ${state.color} flex items-center justify-center`}
                    variants={pulse}
                  >
                    <motion.span 
                      className="text-white text-4xl font-bold drop-shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      {state.name}
                    </motion.span>
                  </motion.div>
                  
                  <div className="p-6 text-center flex flex-col items-center justify-center flex-1">
                    <motion.h3 
                      className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      {state.name} Taekwondo
                    </motion.h3>
                    
                    <motion.div 
                      className="px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold mb-3 inline-flex items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.span 
                        className="inline-block mr-2"
                        animate={{
                          rotate: [0, 360],
                          transition: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }
                        }}
                      >
                        ⏳
                      </motion.span>
                      Coming Soon
                    </motion.div>
                    
                    <motion.p 
                      className="text-gray-400 text-sm max-w-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Union formation in progress. Stay tuned for updates!
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default StateUnion;