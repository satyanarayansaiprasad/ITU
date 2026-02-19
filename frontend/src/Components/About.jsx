import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaFistRaised, FaTrophy, FaFlag, FaMedal,
  FaFire, FaUsers, FaHistory, FaBullseye,
  FaShieldAlt, FaArrowRight, FaGlobeAsia
} from 'react-icons/fa';

const About = () => {

  /* ─── animation variants ─── */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } }
  };
  const cardVariants = {
    offscreen: { y: 60, opacity: 0 },
    onscreen: { y: 0, opacity: 1, transition: { type: 'spring', bounce: 0.35, duration: 0.8 } }
  };
  const floatVariants = {
    float: { y: [0, -14, 0], transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }
  };
  const pulseVariants = {
    pulse: { scale: [1, 1.06, 1], transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }
  };

  /* ─── stats ─── */
  const stats = [
    { value: '50,000+', label: 'Students Trained', color: '#FF9933', icon: <FaUsers /> },
    { value: '500+', label: 'Certified Instructors', color: '#0B2545', icon: <FaShieldAlt /> },
    { value: '2017', label: 'Founded', color: '#138808', icon: <FaHistory /> },
    { value: '200+', label: 'Countries Play Taekwondo', color: '#FF9933', icon: <FaGlobeAsia /> },
  ];

  /* ─── core values ─── */
  const values = [
    {
      icon: <FaFistRaised />,
      title: 'Discipline',
      description: 'Cultivating self-control, focus, and dedication in every practitioner through structured training.',
      color: '#FF9933',
      bg: '#FF993315'
    },
    {
      icon: <FaMedal />,
      title: 'Respect',
      description: 'Honoring traditions, instructors, and fellow students — the cornerstone of martial arts culture.',
      color: '#0B2545',
      bg: '#0B254510'
    },
    {
      icon: <FaTrophy />,
      title: 'Excellence',
      description: 'Striving for the highest standards in training, competition, and character development.',
      color: '#138808',
      bg: '#13880812'
    },
    {
      icon: <FaFire />,
      title: 'Passion',
      description: 'Fueling the spirit of every athlete and instructor with enthusiasm and love for the sport.',
      color: '#FF9933',
      bg: '#FF993315'
    },
    {
      icon: <FaFlag />,
      title: 'National Pride',
      description: 'Representing India on world platforms and inspiring practitioners to carry the national flag high.',
      color: '#138808',
      bg: '#13880812'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Integrity',
      description: 'Running a transparent, merit-based organization — free of politics and bias.',
      color: '#0B2545',
      bg: '#0B254510'
    },
  ];

  /* ─── explore cards (links to subpages) ─── */
  const exploreCards = [
    {
      to: '/about/history',
      icon: <FaHistory />,
      title: 'History of Taekwondo',
      description: 'Trace the 2,000-year journey of Taekwondo from ancient Korea to the Olympic stage.',
      color: '#FF9933',
      gradient: 'linear-gradient(135deg, #FF9933 0%, #e87c12 100%)'
    },
    {
      to: '/about/ambition',
      icon: <FaBullseye />,
      title: 'Our Ambition',
      description: 'Discover ITU\'s vision, mission, and the goals that drive us to elevate Indian Taekwondo.',
      color: '#0B2545',
      gradient: 'linear-gradient(135deg, #0B2545 0%, #13315C 100%)'
    },
    {
      to: '/about/directors',
      icon: <FaUsers />,
      title: 'Union of Directors',
      description: 'Meet the passionate leaders and referees steering Indian Taekwondo Union forward.',
      color: '#138808',
      gradient: 'linear-gradient(135deg, #138808 0%, #0a5c06 100%)'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-16 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #fff9f5 0%, #ffffff 50%, #f5fff8 100%)' }}
    >

      {/* ── Hero Banner ── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '420px' }}>
        {/* Dark gradient backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0B2545 0%, #13315C 55%, #0B2545 100%)' }}
        />

        {/* Concentric rings decoration */}
        <div className="absolute inset-0 overflow-hidden">
          {[160, 280, 400, 520, 640].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                border: '1px solid rgba(255,153,51,0.2)',
                top: '50%',
                right: '-8%',
                transform: 'translateY(-50%)',
                opacity: 0.5 - i * 0.08
              }}
            />
          ))}
        </div>

        {/* Floating background icons */}
        <motion.div
          variants={floatVariants} animate="float"
          className="absolute top-10 right-20 text-[#FF9933]"
          style={{ fontSize: '9rem', opacity: 0.07 }}
        >
          <FaFistRaised />
        </motion.div>
        <motion.div
          variants={floatVariants} animate="float"
          className="absolute bottom-8 left-16 text-[#138808]"
          style={{ fontSize: '7rem', opacity: 0.07 }}
        >
          <FaTrophy />
        </motion.div>

        {/* Tricolour top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Hero content */}
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center"
        >
          {/* Flag icons */}
          <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-5">
            <FaFlag className="text-3xl text-[#FF9933]" />
            <FaFlag className="text-3xl text-white" />
            <FaFlag className="text-3xl text-[#138808]" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4"
          >
            About{' '}
            <span style={{
              background: 'linear-gradient(90deg, #FF9933, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Indian Taekwondo Union
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            India's foremost Taekwondo organization — registered under the Government of Odisha in 2017.
            Empowering 50,000+ students through martial arts, self-defense, and competitive excellence.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 mx-auto w-32 h-1 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
          />
        </motion.div>

        {/* Tricolour bottom stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>


      {/* ── Stats Row ── */}
      <motion.section
        className="max-w-5xl mx-auto px-4 sm:px-6 mt-14 mb-16 relative z-10"
        initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={cardVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.03 }}
                className="rounded-2xl shadow-lg p-6 text-center relative overflow-hidden border border-gray-100"
                style={{ backgroundColor: s.color + '12' }}
              >
                <motion.div
                  variants={floatVariants} animate="float"
                  className="absolute -bottom-4 -right-4 text-7xl"
                  style={{ color: s.color, opacity: 0.08 }}
                >
                  {s.icon}
                </motion.div>
                <div className="text-3xl flex justify-center mb-3" style={{ color: s.color }}>
                  {s.icon}
                </div>
                <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-sm text-gray-600 mt-1 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>


      {/* ── Who We Are ── */}
      <motion.section
        className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
        initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-4 border-[#FF9933] relative overflow-hidden"
        >
          <motion.div
            variants={pulseVariants} animate="pulse"
            className="absolute -bottom-14 -right-14 text-[#FF9933]"
            style={{ fontSize: '16rem', opacity: 0.04 }}
          >
            <FaFistRaised />
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] mb-2 text-center">
            Who We Are
          </h2>
          <div className="w-20 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

          <p className="text-lg text-gray-700 leading-relaxed mb-5 relative z-10">
            The <strong>Indian Taekwondo Union (ITU)</strong> was founded by <strong>Master Mukesh Kumar Sahoo</strong> with
            a clear and noble vision — to establish a national-level organization where Taekwondo players,
            instructors, and referees receive the honor and respect they truly deserve.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed relative z-10">
            Registered under the Government of Odisha, ITU rapidly gained recognition at both national and
            international levels. Today, ITU stands as India's premier martial arts body — championing
            merit, transparency, and the sport's true spirit over commercial interests.
          </p>
        </motion.div>
      </motion.section>


      {/* ── Core Values ── */}
      <motion.section
        className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
        initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={cardVariants}>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] text-center mb-2">
            Our Core Values
          </h2>
          <div className="w-20 h-1 mx-auto mb-10 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-2xl shadow-lg p-7 relative overflow-hidden border border-gray-100"
                style={{ backgroundColor: v.bg }}
              >
                {/* Watermark */}
                <motion.div
                  variants={floatVariants} animate="float"
                  className="absolute -bottom-5 -right-5 text-8xl"
                  style={{ color: v.color, opacity: 0.09 }}
                >
                  {v.icon}
                </motion.div>
                {/* Icon badge */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-5 shadow-md"
                  style={{ backgroundColor: v.color }}
                >
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: v.color }}>{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed relative z-10">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>


      {/* ── Explore More ── */}
      <motion.section
        className="max-w-5xl mx-auto px-4 sm:px-6 mb-10 relative z-10"
        initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={cardVariants}>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] text-center mb-2">
            Explore More
          </h2>
          <div className="w-20 h-1 mx-auto mb-10 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exploreCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link to={card.to} className="block h-full">
                  <div
                    className="rounded-2xl shadow-xl overflow-hidden h-full flex flex-col"
                    style={{ background: card.gradient }}
                  >
                    <div className="h-1 bg-gradient-to-r from-white/40 via-white/10 to-transparent" />
                    <div className="p-7 flex flex-col flex-1 relative overflow-hidden">
                      {/* Watermark */}
                      <div
                        className="absolute -bottom-6 -right-6 text-8xl text-white"
                        style={{ opacity: 0.08 }}
                      >
                        {card.icon}
                      </div>
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white text-xl mb-4 shadow">
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed flex-1">{card.description}</p>
                      <div className="mt-5 flex items-center gap-2 text-white font-semibold text-sm">
                        <span>Learn More</span>
                        <FaArrowRight className="text-xs" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>


      {/* ── Footer Quote ── */}
      <motion.div
        className="text-center mt-8 pb-8 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          variants={pulseVariants} animate="pulse"
          className="mx-auto w-28 h-1 rounded-full mb-6 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
        />
        <motion.h3
          whileHover={{ scale: 1.02 }}
          className="text-2xl font-bold text-[#0B2545] mb-3"
        >
          जय हिंद, जय भारत
        </motion.h3>
        <motion.p
          whileHover={{ scale: 1.01 }}
          className="text-gray-500 max-w-xl mx-auto text-base"
        >
          Proudly serving the nation through sports and discipline since 2017.
        </motion.p>
        <motion.div
          variants={floatVariants} animate="float"
          className="mt-6 flex justify-center gap-3"
        >
          <FaFlag className="text-4xl text-[#FF9933]" />
          <FaFlag className="text-4xl text-gray-300" />
          <FaFlag className="text-4xl text-[#138808]" />
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

export default About;