import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaHistory, FaUsers, FaTrophy, FaGlobeAsia, FaFlag, FaMedal, FaFire, FaFistRaised } from 'react-icons/fa';

const About = () => {
  // Animation variants
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

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  const floatVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const historyTimeline = [
    {
      year: "2016",
      title: "The Vision",
      description: "Master Mukesh Kumar Sahoo envisioned establishing Indian Taekwondo Union to bring respect and honor to Taekwondo players, instructors, and referees."
    },
    {
      year: "2017",
      title: "Establishment",
      description: "Indian Taekwondo Union was officially registered under Govt. of Odisha, formed with the help of Taekwondo instructors and friends."
    },
    {
      year: "2018",
      title: "National Recognition",
      description: "The Union gained rapid popularity across India, providing a platform for Taekwondo practitioners to showcase their skills."
    },
    {
      year: "2019",
      title: "International Presence",
      description: "ITU became recognized at international level, representing Indian Taekwondo on global platforms."
    },
    {
      year: "2023",
      title: "Current Era",
      description: "ITU continues its mission to uplift Taekwondo in India, honoring players and instructors for their hard work and dedication."
    }
  ];

  const ambitions = [
    {
      icon: <FaUsers className="text-4xl text-[#FF9933]" />,
      title: "Community Growth",
      description: "Provide a platform for players, instructors and referees at national and international levels"
    },
    {
      icon: <FaTrophy className="text-4xl text-[#FFFFFF]" />,
      title: "Championship Goals",
      description: "Develop players who can represent India at World Championships and Olympic Games"
    },
    {
      icon: <FaGlobeAsia className="text-4xl text-[#138808]" />,
      title: "Youth Development",
      description: "Attract youth to Taekwondo to keep them away from drugs and crime through sports"
    }
  ];

  // Animated background elements
  const AnimatedBackgroundElements = () => (
    <>
      {/* Floating medals in the background */}
      <motion.div
        variants={floatVariants}
        animate="float"
        className="absolute top-1/4 left-10 opacity-20"
      >
        <FaMedal className="text-6xl text-[#FF9933]" />
      </motion.div>
      <motion.div
        variants={floatVariants}
        animate="float"
        style={{ animationDelay: '1s' }}
        className="absolute top-1/3 right-20 opacity-20"
      >
        <FaMedal className="text-8xl text-[#138808]" />
      </motion.div>
      <motion.div
        variants={floatVariants}
        animate="float"
        style={{ animationDelay: '2s' }}
        className="absolute bottom-1/4 left-1/4 opacity-20"
      >
        <FaMedal className="text-5xl text-[#FFFFFF]" />
      </motion.div>

      {/* Floating Indian flags */}
      <motion.div
        variants={pulseVariants}
        animate="pulse"
        className="absolute top-1/5 right-1/4 opacity-10"
      >
        <FaFlag className="text-9xl text-[#FF9933]" />
      </motion.div>
      <motion.div
        variants={pulseVariants}
        animate="pulse"
        style={{ animationDelay: '1s' }}
        className="absolute bottom-1/5 left-1/3 opacity-10"
      >
        <FaFlag className="text-7xl text-[#138808]" />
      </motion.div>

      {/* Animated taekwondo elements */}
      <motion.div
        variants={floatVariants}
        animate="float"
        style={{ animationDelay: '0.5s' }}
        className="absolute top-1/2 right-10 opacity-10"
      >
        <FaFistRaised className="text-6xl text-[#FFFFFF]" />
      </motion.div>
      <motion.div
        variants={floatVariants}
        animate="float"
        style={{ animationDelay: '1.5s' }}
        className="absolute bottom-1/3 left-20 opacity-10"
      >
        <FaFire className="text-7xl text-[#FF9933]" />
      </motion.div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#FF993311] via-[#FFFFFF11] to-[#13880811] pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative"
    >
      {/* Background elements */}
      <AnimatedBackgroundElements />

      {/* Hero Section with Flag-inspired Header */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto text-center mb-16 relative z-10"
      >
        {/* Flag color bars */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] rounded-full"></div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-8 flex justify-center items-center mb-4 relative"
        >
          {/* Saffron Flag */}
          <FaFlag className="text-4xl text-[#FF9933] mr-2" />
          
          {/* White Flag with Ashoka Chakra */}
          <div className="relative mr-2">
            <FaFlag className="text-4xl text-[#FFFFFF]" />
            {/* Ashoka Chakra */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-[#000080] flex items-center justify-center">
                {/* 24 spokes - simplified version */}
                <div className="relative w-full h-full">
                  {[...Array(24)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-[1px] h-3 bg-[#000080] origin-center"
                      style={{
                        transform: `rotate(${i * 15}deg) translateY(-4px)`,
                        left: '49%',
                        top: '25%'
                      }}
                    />
                  ))}
                  {/* Center dot */}
                  <div className="absolute w-1 h-1 bg-[#000080] rounded-full" 
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Green Flag */}
          <FaFlag className="text-4xl text-[#138808]" />
        </motion.div>
        
        <motion.h1 
          variants={itemVariants} 
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF9933] via-[#0B2545] to-[#138808] bg-clip-text text-transparent mb-4"
        >
          About Indian Taekwondo Union
        </motion.h1>
        <motion.p 
          variants={itemVariants} 
          className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto"
        >
          Empowering individuals through martial arts since 2017. Our journey, values, and vision for the future.
        </motion.p>

        {/* Animated decorative elements */}
        <motion.div
          variants={floatVariants}
          animate="float"
          className="absolute -top-10 -left-10 opacity-20 z-0"
        >
          <FaMedal className="text-8xl text-[#FF9933]" />
        </motion.div>
        <motion.div
          variants={floatVariants}
          animate="float"
          style={{ animationDelay: '1s' }}
          className="absolute -top-5 -right-10 opacity-20 z-0"
        >
          <FaMedal className="text-9xl text-[#138808]" />
        </motion.div>
      </motion.section>

      {/* Introduction with Flag-colored accent */}
      <motion.section 
        className="max-w-7xl mx-auto mb-20 relative z-10"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div 
          variants={cardVariants} 
          className="bg-white rounded-xl shadow-lg p-8 md:p-10 border-t-4 border-[#FF9933] relative overflow-hidden"
        >
          {/* Animated corner decorations */}
          <motion.div
            variants={pulseVariants}
            animate="pulse"
            className="absolute -bottom-10 -left-10 opacity-10"
          >
            <FaFlag className="text-12xl text-[#FF9933]" />
          </motion.div>
          <motion.div
            variants={pulseVariants}
            animate="pulse"
            style={{ animationDelay: '1s' }}
            className="absolute -top-10 -right-10 opacity-10"
          >
            <FaFistRaised className="text-12xl text-[#138808]" />
          </motion.div>

          <h2 className="text-3xl font-bold text-[#0B2545] mb-6 relative z-10 text-center">
          Our Foundation
  <div className="w-24 h-1 mx-auto mt-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full"></div>
</h2>
          <p className="text-lg text-gray-700 mb-6 relative z-10">
            The Indian Taekwondo Union (ITU) was founded by Master Mukesh Kumar Sahoo with the vision to establish 
            a national-level organization where Taekwondo players, instructors, and referees could receive the honor 
            and respect they deserve. Recognizing the exploitation and lack of recognition in the Taekwondo community, 
            Master Sahoo formed ITU in 2017 with the help of dedicated Taekwondo instructors and friends.
          </p>
          <p className="text-lg text-gray-700 relative z-10">
            Registered under the Govt. of Odisha, ITU quickly gained recognition at both national and international levels, 
            committed to fulfilling the dreams of Taekwondo practitioners across India by providing them with proper platforms 
            to showcase their skills and dedication.
          </p>
        </motion.div>
      </motion.section>

      {/* Our Purpose Section */}
      <motion.section 
        className="max-w-7xl mx-auto mb-20 relative z-10"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div 
          variants={cardVariants} 
          className="bg-white rounded-xl shadow-lg p-8 md:p-10 border-t-4 border-[#0B2545] relative overflow-hidden"
        >
          <h2 className="text-3xl font-bold text-[#0B2545] mb-6 relative z-10 text-center">
  Our Purpose
  <div className="w-24 h-1 mx-auto mt-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full"></div>
</h2>
          <div className="space-y-6 relative z-10">
            <p className="text-lg text-gray-700">
              Indian Taekwondo Union was established to address the shortcomings in how Taekwondo was being promoted in India. 
              While other organizations treated Taekwondo as a business, ITU was founded with the pure intention of uplifting 
              the sport to its rightful status.
            </p>
            <p className="text-lg text-gray-700">
              Taekwondo has been practiced in India for a long time but never received the recognition it deserved due to 
              organizational politics. ITU aims to change this by:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Providing respect and honor to players, instructors, and referees based on their hard work</li>
              <li>Elevating Taekwondo's status in India and the global sports community</li>
              <li>Creating opportunities for practitioners at all levels</li>
              <li>Removing the business-oriented approach that has hindered the sport's growth</li>
            </ul>
          </div>
        </motion.div>
      </motion.section>

      {/* Our Ambitions with Flag-colored cards */}
      <motion.section 
        className="max-w-7xl mx-auto mb-20 relative z-10"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={cardVariants}>
          <h2 className="text-3xl font-bold text-[#0B2545] mb-10 text-center relative">
            Our Ambitions
            <div className="w-24 h-1 mx-auto mt-2 bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] rounded-full"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ambitions.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className={`rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                  index === 0 ? 'bg-gradient-to-br from-[#FF993322] to-white' :
                  index === 1 ? 'bg-white border-2 border-[#0B2545]' :
                  'bg-gradient-to-br from-white to-[#13880822]'
                }`}
              >
                {/* Floating medal in card */}
                <motion.div
                  variants={floatVariants}
                  animate="float"
                  className="absolute -bottom-5 -right-5 opacity-10"
                >
                  <FaMedal className={`text-8xl ${
                    index === 0 ? 'text-[#FF9933]' :
                    index === 1 ? 'text-[#0B2545]' :
                    'text-[#138808]'
                  }`} />
                </motion.div>

                <div className="flex justify-center mb-4 relative z-10">
                  {item.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 relative z-10 ${
                  index === 0 ? 'text-[#FF9933]' :
                  index === 1 ? 'text-[#0B2545]' :
                  'text-[#138808]'
                }`}>
                  {item.title}
                </h3>
                <p className="text-gray-600 relative z-10">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* History of ITU with Flag-inspired timeline */}
      <motion.section 
        className="max-w-7xl mx-auto mb-20 relative z-10"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={cardVariants}>
          <h2 className="text-3xl font-bold text-[#0B2545] mb-10 text-center">
            History of ITU
            <div className="w-24 h-1 mx-auto mt-2 bg-gradient-to-r from-[#FF9933] via-[#0B2545] to-[#138808] rounded-full"></div>
          </h2>
          <div className="relative">
            {/* Timeline line with flag colors */}
            <div className="hidden md:block absolute left-1/2 h-full w-1 bg-gradient-to-b from-[#FF9933] via-[#FFFFFF] to-[#138808] transform -translate-x-1/2"></div>
            
            {/* Timeline items */}
            <div className="space-y-8 md:space-y-16">
              {historyTimeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline dot with alternating flag colors */}
                  <div className={`hidden md:flex absolute left-1/2 h-5 w-5 rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 ${
                    index % 3 === 0 ? 'bg-[#FF9933]' :
                    index % 3 === 1 ? 'bg-[#FFFFFF] border-2 border-[#0B2545]' :
                    'bg-[#138808]'
                  }`}></div>
                  
                  {/* Content */}
                  <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className={`bg-white p-6 rounded-xl shadow-lg border-t-2 relative overflow-hidden ${
                        index % 3 === 0 ? 'border-[#FF9933]' :
                        index % 3 === 1 ? 'border-[#0B2545]' :
                        'border-[#138808]'
                      }`}
                    >
                      {/* Animated background element */}
                      <motion.div
                        variants={pulseVariants}
                        animate="pulse"
                        className={`absolute -bottom-10 -right-10 opacity-10 ${
                          index % 3 === 0 ? 'text-[#FF9933]' :
                          index % 3 === 1 ? 'text-[#0B2545]' :
                          'text-[#138808]'
                        }`}
                      >
                        <FaMedal className="text-12xl" />
                      </motion.div>

                      <div className="flex items-center mb-2 relative z-10">
                        <FaHistory className={`mr-2 ${
                          index % 3 === 0 ? 'text-[#FF9933]' :
                          index % 3 === 1 ? 'text-[#0B2545]' :
                          'text-[#138808]'
                        }`} />
                        <span className={`font-bold ${
                          index % 3 === 0 ? 'text-[#FF9933]' :
                          index % 3 === 1 ? 'text-[#0B2545]' :
                          'text-[#138808]'
                        }`}>{item.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 relative z-10">{item.title}</h3>
                      <p className="text-gray-600 relative z-10">{item.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Taekwon! Mission Section */}
      <motion.section 
        className="max-w-7xl mx-auto mb-20 relative z-10"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div 
          variants={cardVariants} 
          className="bg-gradient-to-br from-[#0B2545] to-[#1E3A8A] rounded-xl shadow-lg p-8 md:p-10 relative overflow-hidden"
        >
          {/* Animated elements */}
          <motion.div
            variants={floatVariants}
            animate="float"
            className="absolute -top-20 -left-20 opacity-10"
          >
            <FaFistRaised className="text-24xl text-[#FF9933]" />
          </motion.div>
          <motion.div
            variants={floatVariants}
            animate="float"
            style={{ animationDelay: '1s' }}
            className="absolute -bottom-20 -right-20 opacity-10"
          >
            <FaTrophy className="text-24xl text-[#138808]" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-6 relative z-10">
             Our Mission
            <div className="w-24 h-1 mt-2 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] rounded-full"></div>
          </h2>
          
          <div className="space-y-6 text-white relative z-10">
            <p className="text-lg">
              Indian Taekwondo Union's ambition is not to run a business, but to uplift Taekwondo sport not only in India 
              but at the world level. Our mission is to:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Provide a platform for players, instructors and referees at national and international levels</li>
              <li>Give name, fame and honor to practitioners in the sports world and public eye</li>
              <li>Attract children and youth of all ages to Taekwondo, keeping them away from drugs and crime</li>
              <li>Develop players who can perform extraordinarily at International, World Championship and Olympic Games</li>
              <li>See our young practitioners hold the National Flag high at international competitions</li>
            </ul>
            <p className="text-lg font-medium">
              It would be our greatest honor if our efforts help any Indian player reach the top level of World Championship 
              and Olympic Games. The success of even a single child through ITU would validate all our hard work and dedication.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Values Section with Flag-inspired design */}
      <motion.section 
        className="max-w-7xl mx-auto relative z-10"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div 
          variants={cardVariants} 
          className="rounded-xl shadow-lg overflow-hidden"
        >
          <div className="h-2 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]"></div>
          <div className="bg-[#0B2545] p-8 md:p-10 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
              variants={floatVariants}
              animate="float"
              className="absolute -top-20 -left-20 opacity-10"
            >
              <FaFlag className="text-24xl text-[#FF9933]" />
            </motion.div>
            <motion.div
              variants={floatVariants}
              animate="float"
              style={{ animationDelay: '1s' }}
              className="absolute -bottom-20 -right-20 opacity-10"
            >
              <FaFistRaised className="text-24xl text-[#138808]" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-6 relative z-10">
              Our Core Values
              <div className="w-24 h-1 mt-2 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] rounded-full"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {[
                { 
                  title: "Discipline", 
                  description: "Cultivating self-control and dedication in all practitioners",
                  color: "from-[#FF9933] to-[#FF993366]",
                  icon: <FaFistRaised className="text-4xl mb-3" />
                },
                { 
                  title: "Respect", 
                  description: "Honoring traditions, instructors, and fellow students",
                  color: "from-[#FFFFFF] to-[#FFFFFF66]",
                  icon: <FaMedal className="text-4xl mb-3" />
                },
                { 
                  title: "Excellence", 
                  description: "Striving for the highest standards in training and competition",
                  color: "from-[#138808] to-[#13880866]",
                  icon: <FaTrophy className="text-4xl mb-3" />
                },
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-br ${value.color} p-5 rounded-lg`}
                >
                  <motion.div
                    variants={floatVariants}
                    animate="float"
                    className="flex justify-center"
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-200">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Animated decorative footer */}
      <motion.div 
        className="mt-20 text-center relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="mx-auto w-24 h-1 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] rounded-full mb-6"
        ></motion.div>
        <motion.h3 
          className="text-2xl font-bold text-[#0B2545] mb-4"
          whileHover={{ scale: 1.02 }}
        >
          जय हिंद, जय भारत
        </motion.h3>
        <motion.p 
          className="text-gray-600 max-w-2xl mx-auto"
          whileHover={{ scale: 1.01 }}
        >
          Proudly serving the nation through sports and discipline since 2017
        </motion.p>
        <motion.div
          variants={floatVariants}
          animate="float"
          className="mt-6 flex justify-center"
        >
          <FaFlag className="text-6xl text-[#FF9933]" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;