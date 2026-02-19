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

    /* ─── Ambition pillars (unique to this subpage) ─── */
    const pillars = [
        {
            icon: <FaGlobeAsia />,
            title: 'Elevate Taekwondo Globally',
            description:
                "Not merely promote Taekwondo inside India \u2014 but raise the sport's standing on the world stage, making India a powerhouse nation in global Taekwondo rankings.",
            color: '#FF9933',
            bg: '#FF993315'
        },
        {
            icon: <FaMedal />,
            title: 'Name, Fame & Honor',
            description:
                'Bring genuine recognition to players, instructors, and referees — in the sports world and among the general public — based purely on skill and hard work.',
            color: '#0B2545',
            bg: '#0B254510'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Sport Over Business',
            description:
                'Reject the commercialization of Taekwondo. ITU was built not to run a business, but to serve the sport and its people with integrity and transparency.',
            color: '#138808',
            bg: '#13880812'
        },
        {
            icon: <FaFire />,
            title: 'Ignite Youth Potential',
            description:
                'Channel the energy of India\'s youth productively — keeping them away from drugs, violence, and crime by engaging them in structured Taekwondo programs.',
            color: '#FF9933',
            bg: '#FF993315'
        },
        {
            icon: <FaTrophy />,
            title: 'Olympic Dream',
            description:
                'Develop Indian Taekwondo players capable of performing extraordinarily at International Championships, World Championships, and the Olympic Games.',
            color: '#0B2545',
            bg: '#0B254510'
        },
        {
            icon: <FaFlag />,
            title: "Raise India's Flag",
            description:
                'Our greatest ambition: to see boys and girls of India proudly holding the National Flag high at international competitions, bringing glory to the country.',
            color: '#138808',
            bg: '#13880812'
        }
    ];

    /* ─── journey milestones (unique, forward-looking) ─── */
    const milestones = [
        {
            phase: 'Phase 1 — 2017–2020',
            title: 'Foundation & Recognition',
            description: 'Registered under Govt. of Odisha, built national-level recognition, and enrolled the first wave of students and instructors across India.',
            color: '#FF9933'
        },
        {
            phase: 'Phase 2 — 2020–2024',
            title: 'Growth & Expansion',
            description: 'Expanded to state unions and districts, launched structured belt-promotion programs, and hosted national-level competitions to discover talent.',
            color: '#0B2545'
        },
        {
            phase: 'Phase 3 — 2025 Onwards',
            title: 'World Stage',
            description: "Preparing elite players for international competitions, World Championships, and the Olympic Games \u2014 bringing India's flag to the highest podiums.",
            color: '#138808'
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
            <section className="relative w-full overflow-hidden" style={{ minHeight: '420px' }}>
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #0B2545 0%, #13315C 60%, #0B2545 100%)' }}
                />

                {/* Concentric rings */}
                <div className="absolute inset-0 overflow-hidden">
                    {[160, 280, 400, 520, 640].map((size, i) => (
                        <div key={i} className="absolute rounded-full" style={{
                            width: `${size}px`, height: `${size}px`,
                            border: '1px solid rgba(255,153,51,0.25)',
                            top: '50%', right: '-10%',
                            transform: 'translateY(-50%)',
                            opacity: 0.4 - i * 0.06
                        }} />
                    ))}
                </div>

                {/* Floating icons */}
                <motion.div variants={floatVariants} animate="float"
                    className="absolute top-10 right-20 text-[#FF9933]"
                    style={{ fontSize: '9rem', opacity: 0.08 }}>
                    <FaBullseye />
                </motion.div>
                <motion.div variants={floatVariants} animate="float"
                    className="absolute bottom-8 left-16 text-[#138808]"
                    style={{ fontSize: '7rem', opacity: 0.08 }}>
                    <FaTrophy />
                </motion.div>
                <motion.div variants={floatVariants} animate="float"
                    className="absolute top-12 left-24 text-[#FF9933]"
                    style={{ fontSize: '5rem', opacity: 0.06 }}>
                    <FaFistRaised />
                </motion.div>

                {/* Tricolour strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                {/* Hero content */}
                <motion.div
                    variants={containerVariants} initial="hidden" animate="visible"
                    className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center"
                >
                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 font-bold text-sm tracking-widest"
                        style={{ background: 'linear-gradient(90deg, #FF9933, #ffd700)', color: '#0B2545' }}
                    >
                        <FaFistRaised /><span>TAEKWON!</span>
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
                        <span style={{
                            background: 'linear-gradient(90deg, #FF9933, #FFD700)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Ambition
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        Indian Taekwondo Union — registered by Government of Odisha since 2017.
                        Our ambition is not to run a business, but to uplift Taekwondo in India and on the world stage.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mt-8 mx-auto w-32 h-1 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
                    />
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            </section>


            {/* ── What We Aim For ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mt-14 mb-16 relative z-10"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    variants={cardVariants}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-4 border-[#FF9933] relative overflow-hidden"
                >
                    <motion.div variants={pulseVariants} animate="pulse"
                        className="absolute -bottom-14 -right-14 text-[#FF9933]"
                        style={{ fontSize: '16rem', opacity: 0.04 }}>
                        <FaBullseye />
                    </motion.div>

                    <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] mb-2 text-center">
                        What We Aim For
                    </h2>
                    <div className="w-20 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                    <p className="text-lg text-gray-700 leading-relaxed mb-5 relative z-10">
                        While many organizations treat Taekwondo as a commercial enterprise, <strong>ITU was founded
                            on a fundamentally different premise</strong> — to restore Taekwondo's dignity as a sport and give
                        every dedicated practitioner the recognition they deserve.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed relative z-10">
                        Our ambition spans from grassroots development to the Olympic podium. We believe
                        India has the talent — what it needs is the right platform. ITU is that platform.
                    </p>
                </motion.div>
            </motion.section>


            {/* ── Ambition Pillars ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.1 }}
            >
                <motion.div variants={cardVariants}>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] text-center mb-2">
                        Six Pillars of Our Ambition
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
                                <motion.div variants={floatVariants} animate="float"
                                    className="absolute -bottom-5 -right-5 text-8xl"
                                    style={{ color: p.color, opacity: 0.09 }}>
                                    {p.icon}
                                </motion.div>
                                {/* Icon badge */}
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-5 shadow-md"
                                    style={{ backgroundColor: p.color }}>
                                    {p.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: p.color }}>{p.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed relative z-10">{p.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.section>


            {/* ── Roadmap ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div variants={cardVariants}>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] text-center mb-2">
                        Our Roadmap to Glory
                    </h2>
                    <div className="w-20 h-1 mx-auto mb-10 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="hidden md:block absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-[#FF9933] via-[#0B2545] to-[#138808] rounded-full" />

                        <div className="space-y-8">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="relative flex gap-6 items-start"
                                >
                                    {/* Dot */}
                                    <div
                                        className="hidden md:flex flex-shrink-0 w-5 h-5 rounded-full mt-3 shadow-lg z-10"
                                        style={{ backgroundColor: m.color, marginLeft: '5px' }}
                                    />
                                    {/* Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-2xl shadow-lg p-6 flex-1 border-l-4 relative overflow-hidden"
                                        style={{ borderLeftColor: m.color }}
                                    >
                                        <motion.div variants={floatVariants} animate="float"
                                            className="absolute -bottom-6 -right-6 text-8xl"
                                            style={{ color: m.color, opacity: 0.05 }}>
                                            <FaTrophy />
                                        </motion.div>
                                        <span
                                            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                                            style={{ backgroundColor: m.color + '18', color: m.color }}
                                        >
                                            {m.phase}
                                        </span>
                                        <h3 className="text-lg font-bold text-[#0B2545] mb-2 relative z-10">{m.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed relative z-10">{m.description}</p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.section>


            {/* ── Olympic Dream ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    variants={cardVariants}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-4 border-[#138808] relative overflow-hidden"
                >
                    <motion.div variants={pulseVariants} animate="pulse"
                        className="absolute -bottom-14 -right-14 text-[#138808]"
                        style={{ fontSize: '18rem', opacity: 0.04 }}>
                        <FaTrophy />
                    </motion.div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow"
                            style={{ backgroundColor: '#138808' }}>
                            <FaTrophy />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545]">The Olympic Dream</h2>
                    </div>
                    <div className="w-20 h-1 mb-6 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                    <p className="text-lg text-gray-700 leading-relaxed mb-5 relative z-10">
                        We firmly believe that our players can deliver{' '}
                        <strong className="text-[#138808]">extraordinary performances</strong> at International
                        Championships, World Championships, and the Olympic Games. We dream that the boys and girls of
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
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    variants={cardVariants}
                    className="rounded-2xl shadow-xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #FF9933 0%, #e87c12 100%)' }}
                >
                    <div className="p-8 md:p-10 text-center relative overflow-hidden">
                        {/* Watermarks */}
                        <motion.div variants={floatVariants} animate="float"
                            className="absolute -top-10 -left-10 text-white"
                            style={{ fontSize: '12rem', opacity: 0.08 }}><FaHeart /></motion.div>
                        <motion.div variants={floatVariants} animate="float"
                            className="absolute -bottom-10 -right-10 text-white"
                            style={{ fontSize: '10rem', opacity: 0.08 }}><FaStar /></motion.div>

                        <div className="relative z-10">
                            <motion.div variants={pulseVariants} animate="pulse"
                                className="text-5xl text-white flex justify-center mb-5">
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
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            >
                <motion.div variants={pulseVariants} animate="pulse"
                    className="mx-auto w-28 h-1 rounded-full mb-6 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
                />
                <motion.h3 whileHover={{ scale: 1.02 }}
                    className="text-2xl font-bold text-[#0B2545] mb-3">
                    जय हिंद, जय भारत
                </motion.h3>
                <motion.p whileHover={{ scale: 1.01 }}
                    className="text-gray-500 max-w-xl mx-auto text-base">
                    Indian Taekwondo Union — Building champions, inspiring a nation since 2017.
                </motion.p>
                <motion.div variants={floatVariants} animate="float"
                    className="mt-6 flex justify-center gap-3">
                    <FaFlag className="text-4xl text-[#FF9933]" />
                    <FaFlag className="text-4xl text-gray-300" />
                    <FaFlag className="text-4xl text-[#138808]" />
                </motion.div>
            </motion.div>

        </motion.div>
    );
};

export default OurAmbition;
