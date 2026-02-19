import React from 'react';
import { motion } from 'framer-motion';
import {
    FaFistRaised, FaTrophy, FaFlag, FaMedal,
    FaFire, FaStar, FaUsers, FaShieldAlt,
    FaGlobeAsia, FaHeart, FaBullseye
} from 'react-icons/fa';

const OurAmbition = () => {

    /* ─── animation variants ─── */
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 12 }
        }
    };

    const cardVariants = {
        offscreen: { y: 60, opacity: 0 },
        onscreen: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', bounce: 0.35, duration: 0.8 }
        }
    };

    const floatVariants = {
        float: {
            y: [0, -14, 0],
            transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
        }
    };

    const pulseVariants = {
        pulse: {
            scale: [1, 1.06, 1],
            transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
        }
    };

    /* ─── pillars data ─── */
    const pillars = [
        {
            icon: <FaUsers />,
            title: 'Promote & Uplift',
            description:
                'Uplift the sport of Taekwondo not only in India but at the world level — providing a strong, respected platform for players, instructors, and referees.',
            color: '#FF9933',
            bg: '#FF993315'
        },
        {
            icon: <FaMedal />,
            title: 'Name, Fame & Honor',
            description:
                'Bring name, fame, and honor to players, instructors, and referees in the sports world and among the general public.',
            color: '#0B2545',
            bg: '#0B254510'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Discipline & Character',
            description:
                'Build discipline, confidence, courage, and leadership qualities through structured Taekwondo training for every practitioner.',
            color: '#138808',
            bg: '#13880812'
        },
        {
            icon: <FaFire />,
            title: 'Youth Development',
            description:
                'Attract children of all ages and the youth of India towards Taekwondo — keeping the young generation away from drugs, violence, and crime.',
            color: '#FF9933',
            bg: '#FF993315'
        },
        {
            icon: <FaTrophy />,
            title: 'World-Class Performance',
            description:
                'Develop players who can deliver extraordinary performances at International Championships, World Championships, and the Olympic Games.',
            color: '#0B2545',
            bg: '#0B254510'
        },
        {
            icon: <FaFlag />,
            title: 'National Pride',
            description:
                'Our dream: boys and girls of India proudly holding the National Flag high at international platforms, bringing glory to the country.',
            color: '#138808',
            bg: '#13880812'
        }
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
            <section className="relative w-full overflow-hidden" style={{ minHeight: '400px' }}>
                {/* Dark gradient backdrop */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #0B2545 0%, #13315C 60%, #0B2545 100%)' }}
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
                                border: '1px solid rgba(255,153,51,0.25)',
                                top: '50%',
                                right: '-10%',
                                transform: 'translateY(-50%)',
                                opacity: 0.4 - i * 0.06
                            }}
                        />
                    ))}
                </div>

                {/* Floating background icons */}
                <motion.div
                    variants={floatVariants}
                    animate="float"
                    className="absolute top-10 right-20 text-[#FF9933]"
                    style={{ fontSize: '9rem', opacity: 0.08 }}
                >
                    <FaBullseye />
                </motion.div>
                <motion.div
                    variants={floatVariants}
                    animate="float"
                    className="absolute bottom-8 left-16 text-[#138808]"
                    style={{ fontSize: '7rem', opacity: 0.08 }}
                >
                    <FaTrophy />
                </motion.div>
                <motion.div
                    variants={floatVariants}
                    animate="float"
                    className="absolute top-12 left-24 text-[#FF9933]"
                    style={{ fontSize: '5rem', opacity: 0.06 }}
                >
                    <FaFistRaised />
                </motion.div>

                {/* Tricolour top stripe */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                {/* Hero content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center"
                >
                    {/* Taekwon! badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 font-bold text-sm tracking-widest"
                        style={{
                            background: 'linear-gradient(90deg, #FF9933, #ffd700)',
                            color: '#0B2545'
                        }}
                    >
                        <FaFistRaised />
                        <span>TAEKWON!</span>
                    </motion.div>

                    {/* Flag icons */}
                    <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-4">
                        <FaFlag className="text-3xl text-[#FF9933]" />
                        <FaFlag className="text-3xl text-white" />
                        <FaFlag className="text-3xl text-[#138808]" />
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4"
                    >
                        Our{' '}
                        <span
                            style={{
                                background: 'linear-gradient(90deg, #FF9933, #FFD700)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Ambition
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        Indian Taekwondo Union — Registered by Government of Odisha since 2017.
                        Dedicated to uplifting Taekwondo in India and on the world stage.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mt-8 mx-auto w-32 h-1 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
                    />
                </motion.div>

                {/* Tricolour bottom stripe */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            </section>



            {/* ── Pillars Grid ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.1 }}
            >
                <motion.div variants={cardVariants}>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] text-center mb-2">
                        What We Stand For
                    </h2>
                    <div className="w-20 h-1 mx-auto mb-10 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pillars.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="rounded-2xl shadow-lg p-7 relative overflow-hidden border border-gray-100"
                                style={{ backgroundColor: p.bg }}
                            >
                                {/* Watermark icon */}
                                <motion.div
                                    variants={floatVariants}
                                    animate="float"
                                    className="absolute -bottom-5 -right-5 text-8xl"
                                    style={{ color: p.color, opacity: 0.09 }}
                                >
                                    {p.icon}
                                </motion.div>

                                {/* Icon badge */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-5 shadow-md"
                                    style={{ backgroundColor: p.color }}
                                >
                                    {p.icon}
                                </div>

                                <h3 className="text-lg font-bold mb-2" style={{ color: p.color }}>
                                    {p.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                                    {p.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            {/* ── Youth Focus Card ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    variants={cardVariants}
                    className="rounded-2xl shadow-xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0B2545 0%, #13315C 100%)' }}
                >
                    <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                    {/* Floating decorations */}
                    <motion.div
                        variants={floatVariants}
                        animate="float"
                        className="absolute -top-10 -left-10 text-[#FF9933]"
                        style={{ fontSize: '12rem', opacity: 0.07 }}
                    >
                        <FaUsers />
                    </motion.div>
                    <motion.div
                        variants={floatVariants}
                        animate="float"
                        className="absolute -bottom-10 -right-10 text-[#138808]"
                        style={{ fontSize: '10rem', opacity: 0.07 }}
                    >
                        <FaShieldAlt />
                    </motion.div>

                    <div className="p-8 md:p-10 relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow"
                                style={{ backgroundColor: '#FF9933' }}
                            >
                                <FaFire />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                Empowering Indian Youth
                            </h2>
                        </div>
                        <div className="w-20 h-1 mb-6 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                        <p className="text-gray-200 text-lg leading-relaxed mb-6">
                            The Union is committed to attracting <strong className="text-[#FF9933]">children of all ages</strong>{' '}
                            and the youth of India towards sports, especially Taekwondo. Our goal is to keep
                            the young generation away from drugs, violence, and crime by engaging them in
                            healthy physical and mental development through Taekwondo, martial arts, and
                            self-defence training.
                        </p>

                        {/* Stats row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            {[
                                { value: 'Discipline', icon: <FaShieldAlt />, color: '#FF9933', sub: 'Core value instilled' },
                                { value: 'Confidence', icon: <FaStar />, color: '#FFFFFF', sub: 'Built through training' },
                                { value: 'Leadership', icon: <FaUsers />, color: '#46d87a', sub: 'Developed for life' }
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -4 }}
                                    className="text-center p-5 rounded-xl"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                                >
                                    <div className="text-3xl mb-2 flex justify-center" style={{ color: s.color }}>
                                        {s.icon}
                                    </div>
                                    <div className="text-white font-bold text-lg">{s.value}</div>
                                    <div className="text-gray-400 text-sm mt-1">{s.sub}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="h-1.5 bg-gradient-to-r from-[#138808] via-white to-[#FF9933]" />
                </motion.div>
            </motion.section>

            {/* ── Olympic Dream ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    variants={cardVariants}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-4 border-[#138808] relative overflow-hidden"
                >
                    <motion.div
                        variants={pulseVariants}
                        animate="pulse"
                        className="absolute -bottom-14 -right-14 text-[#138808]"
                        style={{ fontSize: '18rem', opacity: 0.04 }}
                    >
                        <FaTrophy />
                    </motion.div>

                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow"
                            style={{ backgroundColor: '#138808' }}
                        >
                            <FaTrophy />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545]">
                            The Olympic Dream
                        </h2>
                    </div>
                    <div className="w-20 h-1 mb-6 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                    <p className="text-lg text-gray-700 leading-relaxed mb-5 relative z-10">
                        We strongly believe that our players can deliver{' '}
                        <strong className="text-[#138808]">extraordinary performances</strong> at International
                        Championships, World Championships, and the Olympic Games. We dream that boys and girls of
                        India will proudly hold the{' '}
                        <strong className="text-[#FF9933]">National Flag</strong> high at international platforms
                        and bring glory to the country.
                    </p>

                    {/* Highlight quote */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="rounded-xl p-6 border-l-4 border-[#FF9933] relative z-10"
                        style={{ backgroundColor: '#FF993310' }}
                    >
                        <div className="flex items-start gap-4">
                            <FaFlag className="text-3xl text-[#FF9933] flex-shrink-0 mt-1" />
                            <p className="text-gray-700 text-base leading-relaxed italic">
                                "It would be a matter of great pride and honor for the Indian Taekwondo Union
                                if our dedication and commitment help even a single child or youth reach the top
                                level of the World Championships or the Olympic Games."
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* ── Closing Pledge ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-10 relative z-10"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    variants={cardVariants}
                    className="rounded-2xl shadow-xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #FF9933 0%, #e87c12 100%)' }}
                >
                    <div className="p-8 md:p-10 text-center relative overflow-hidden">
                        {/* Watermarks */}
                        <motion.div
                            variants={floatVariants}
                            animate="float"
                            className="absolute -top-10 -left-10 text-white"
                            style={{ fontSize: '12rem', opacity: 0.08 }}
                        >
                            <FaHeart />
                        </motion.div>
                        <motion.div
                            variants={floatVariants}
                            animate="float"
                            className="absolute -bottom-10 -right-10 text-white"
                            style={{ fontSize: '10rem', opacity: 0.08 }}
                        >
                            <FaStar />
                        </motion.div>

                        <div className="relative z-10">
                            <motion.div
                                variants={pulseVariants}
                                animate="pulse"
                                className="text-5xl text-white flex justify-center mb-5"
                            >
                                <FaGlobeAsia />
                            </motion.div>

                            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                                True Success Is One Champion
                            </h2>

                            <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto opacity-95">
                                If one Indian athlete rises to the top in the sports world, we will consider
                                that our hard work and values have achieved{' '}
                                <strong>true success</strong>.
                            </p>

                            <div className="mt-8 flex justify-center gap-4">
                                <FaFlag className="text-4xl text-white opacity-90" />
                                <FaFlag className="text-4xl text-white opacity-60" />
                                <FaFlag className="text-4xl text-white opacity-90" />
                            </div>
                        </div>
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
                    variants={pulseVariants}
                    animate="pulse"
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
                    Indian Taekwondo Union — Building champions, inspiring a nation since 2017.
                </motion.p>
                <motion.div
                    variants={floatVariants}
                    animate="float"
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

export default OurAmbition;
