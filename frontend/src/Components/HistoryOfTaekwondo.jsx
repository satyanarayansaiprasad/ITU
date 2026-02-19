import React from 'react';
import { motion } from 'framer-motion';
import {
    FaHistory, FaTrophy, FaGlobeAsia, FaFlag, FaMedal,
    FaFire, FaFistRaised, FaStar, FaUsers
} from 'react-icons/fa';

const HistoryOfTaekwondo = () => {

    /* ─── animation variants ─── */
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.2 } }
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

    /* ─── world timeline data ─── */
    const worldTimeline = [
        {
            era: '2,000+ Years Ago',
            title: 'Ancient Roots',
            description:
                'The roots of Taekwondo trace back over 2,000 years to ancient Korea. During the Three Kingdoms period, martial arts were practiced for self-defense and military training.',
            icon: <FaHistory />,
            color: '#FF9933'
        },
        {
            era: 'Three Kingdoms Era',
            title: 'Subak & Taekkyeon',
            description:
                'Ancient Korean martial arts Subak and Taekkyeon laid the foundation for modern Taekwondo — emphasizing powerful kicks, open-hand strikes, and disciplined footwork.',
            icon: <FaFistRaised />,
            color: '#0B2545'
        },
        {
            era: '20th Century',
            title: 'Post-WWII Revival',
            description:
                'After World War II, various Korean martial arts schools called "Kwans" were established across Korea, reviving and refining the native fighting traditions.',
            icon: <FaFlag />,
            color: '#138808'
        },
        {
            era: '1955',
            title: 'The Name "Taekwondo"',
            description:
                'The name "Taekwondo" was officially adopted in Korea in 1955, unifying the various Kwan styles under a single identity and overarching philosophy.',
            icon: <FaStar />,
            color: '#FF9933'
        },
        {
            era: '1973',
            title: 'World Taekwondo Founded',
            description:
                'World Taekwondo (WT) was established in 1973. The same year, the first World Taekwondo Championships were held in Seoul, South Korea — launching the sport globally.',
            icon: <FaTrophy />,
            color: '#0B2545'
        },
        {
            era: 'Sydney 2000',
            title: 'Olympic Sport',
            description:
                'Taekwondo became an official Olympic sport at the Sydney 2000 Summer Olympics, cementing its place as a premier global combat sport watched by billions.',
            icon: <FaMedal />,
            color: '#138808'
        },
        {
            era: 'Today',
            title: 'Global Phenomenon',
            description:
                'Practiced in more than 200 countries, recognized by the International Olympic Committee, and growing every year, Taekwondo is one of the most popular martial arts in the world.',
            icon: <FaGlobeAsia />,
            color: '#FF9933'
        }
    ];

    /* ─── word meaning cards ─── */
    const wordMeaning = [
        {
            korean: 'Tae',
            meaning: 'Foot',
            description: 'Refers to the powerful kicking techniques that distinguish Taekwondo from other martial arts.',
            color: '#FF9933',
            bgColor: '#FF993318'
        },
        {
            korean: 'Kwon',
            meaning: 'Hand or Fist',
            description: 'Represents punching and open-hand striking techniques used in combat and competition.',
            color: '#0B2545',
            bgColor: '#0B254510'
        },
        {
            korean: 'Do',
            meaning: 'Way or Discipline',
            description: 'The philosophical path — a disciplined way of life through the practice of martial arts.',
            color: '#138808',
            bgColor: '#13880812'
        }
    ];

    /* ─── ITU's history in India milestones ─── */
    const indiaMilestones = [
        {
            year: '1970s',
            title: 'Taekwondo Arrives in India',
            description: 'Taekwondo was introduced in India in the 1970s, gradually spreading through defense institutions, schools, and private academies.',
            color: '#FF9933',
            icon: <FaFlag />
        },
        {
            year: '1990s–2000s',
            title: 'National Growth',
            description: 'Indian players began competing at Asian Championships and World Championships. The sport spread to multiple states and found a grassroots audience.',
            color: '#0B2545',
            icon: <FaUsers />
        },
        {
            year: '2017',
            title: 'ITU Founded',
            description: 'The Indian Taekwondo Union was established by Master Mukesh Kumar Sahoo — registered under the Government of Odisha with a mission to honor players and uplift the sport.',
            color: '#138808',
            icon: <FaTrophy />
        },
        {
            year: 'Today',
            title: 'Rising Force',
            description: 'With 50,000+ students and 500+ certified instructors, ITU is building India\'s next generation of Taekwondo champions for the Olympic stage.',
            color: '#FF9933',
            icon: <FaMedal />
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
                {/* Gradient backdrop */}
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #0B2545 0%, #13315C 50%, #0B2545 100%)' }}
                />

                {/* Decorative concentric circles */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    {[120, 200, 280, 360, 440, 520].map((size, i) => (
                        <div key={i} className="absolute rounded-full" style={{
                            width: `${size}px`, height: `${size}px`,
                            border: '1px solid rgba(255,153,51,0.5)',
                            top: `${-size / 4}px`, left: `${-size / 4}px`,
                        }} />
                    ))}
                </div>

                {/* Floating background icons */}
                <motion.div variants={floatVariants} animate="float"
                    className="absolute top-8 right-16 opacity-10 text-[#FF9933]"
                    style={{ fontSize: '9rem' }}>
                    <FaFistRaised />
                </motion.div>
                <motion.div variants={floatVariants} animate="float"
                    style={{ fontSize: '7rem' }}
                    className="absolute bottom-8 left-16 opacity-10 text-[#138808]">
                    <FaMedal />
                </motion.div>

                {/* Flag bar at very top */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                {/* Hero content */}
                <motion.div
                    variants={containerVariants} initial="hidden" animate="visible"
                    className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center"
                >
                    {/* Flag icon row */}
                    <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-6">
                        <FaFlag className="text-3xl text-[#FF9933]" />
                        <FaFlag className="text-3xl text-white" />
                        <FaFlag className="text-3xl text-[#138808]" />
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4"
                    >
                        History of{' '}
                        <span style={{
                            background: 'linear-gradient(90deg, #FF9933, #FFD700)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Taekwondo
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        From ancient Korean battlefields to the Olympic Games — a 2,000-year journey
                        of martial arts mastery, discipline, and global recognition.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mt-8 mx-auto w-32 h-1 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
                    />
                </motion.div>

                {/* Flag bar at very bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            </section>


            {/* ── Word Meaning Cards ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mt-14 mb-16 relative z-10"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div variants={cardVariants}>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] text-center mb-2">
                        The Meaning of Taekwondo
                    </h2>
                    <div className="w-20 h-1 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                    <p className="text-center text-gray-500 mb-8 text-base">"The Way of the Foot and Fist"</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {wordMeaning.map((w, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="rounded-2xl shadow-lg p-7 text-center relative overflow-hidden border border-gray-100"
                                style={{ backgroundColor: w.bgColor }}
                            >
                                <motion.div variants={floatVariants} animate="float"
                                    className="absolute -bottom-6 -right-6 text-8xl"
                                    style={{ color: w.color, opacity: 0.1 }}>
                                    <FaFistRaised />
                                </motion.div>
                                <div className="text-5xl font-extrabold mb-1" style={{ color: w.color }}>{w.korean}</div>
                                <div className="text-xl font-bold mb-3" style={{ color: w.color }}>— {w.meaning}</div>
                                <p className="text-gray-600 text-sm leading-relaxed relative z-10">{w.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Full phrase banner */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="mt-8 rounded-2xl overflow-hidden shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #0B2545, #13315C)' }}
                    >
                        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                        <div className="p-6 text-center">
                            <p className="text-white text-lg md:text-xl font-medium">
                                So, <strong className="text-[#FF9933]">Taekwondo</strong> means —{' '}
                                <em className="text-yellow-300">"The Way of the Foot and Fist"</em>
                            </p>
                        </div>
                        <div className="h-1 bg-gradient-to-r from-[#138808] via-white to-[#FF9933]" />
                    </motion.div>
                </motion.div>
            </motion.section>


            {/* ── World Timeline ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.1 }}
            >
                <motion.div variants={cardVariants}>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] text-center mb-2">
                        A Journey Through Time
                    </h2>
                    <div className="w-20 h-1 mx-auto mb-10 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] transform -translate-x-1/2 rounded-full" />

                        <div className="space-y-10 md:space-y-16">
                            {worldTimeline.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.55, delay: index * 0.05 }}
                                    className={`relative flex flex-col md:flex-row${index % 2 === 0 ? ' md:flex-row-reverse' : ''}`}
                                >
                                    {/* Dot on timeline */}
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 w-5 h-5 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg"
                                        style={{ backgroundColor: item.color }} />

                                    {/* Card */}
                                    <div className={`md:w-5/12${index % 2 === 0 ? ' md:pr-10' : ' md:pl-10'}`}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 relative overflow-hidden"
                                            style={{ borderLeftColor: item.color }}
                                        >
                                            <motion.div variants={pulseVariants} animate="pulse"
                                                className="absolute -bottom-8 -right-8 text-9xl"
                                                style={{ color: item.color, opacity: 0.05 }}>
                                                {item.icon}
                                            </motion.div>

                                            <div className="flex items-center gap-3 mb-3 relative z-10">
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm shadow-md"
                                                    style={{ backgroundColor: item.color }}>
                                                    {item.icon}
                                                </div>
                                                <span className="font-bold text-sm px-3 py-1 rounded-full"
                                                    style={{ backgroundColor: item.color + '18', color: item.color }}>
                                                    {item.era}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-[#0B2545] mb-2 relative z-10">{item.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed relative z-10">{item.description}</p>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.section>


            {/* ── Global Recognition Banner ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.25 }}
            >
                <motion.div
                    variants={cardVariants}
                    className="rounded-2xl shadow-xl overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #0B2545 0%, #13315C 100%)' }}
                >
                    <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                    <motion.div variants={floatVariants} animate="float"
                        className="absolute -top-12 -left-12 text-[#FF9933]"
                        style={{ fontSize: '12rem', opacity: 0.1 }}>
                        <FaMedal />
                    </motion.div>
                    <motion.div variants={floatVariants} animate="float"
                        className="absolute -bottom-12 -right-12 text-[#138808]"
                        style={{ fontSize: '10rem', opacity: 0.1 }}>
                        <FaTrophy />
                    </motion.div>

                    <div className="p-8 md:p-10 relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Global Recognition</h2>
                        <div className="w-20 h-1 mb-6 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { stat: '200+', label: 'Countries', sub: 'Taekwondo practiced worldwide', color: '#FF9933' },
                                { stat: '2000', label: 'Olympic Debut', sub: 'Sydney Summer Olympics', color: '#FFFFFF' },
                                { stat: '1973', label: 'World Body', sub: 'World Taekwondo established', color: '#46d87a' }
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="text-center p-5 rounded-xl"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                                >
                                    <div className="text-4xl font-extrabold mb-1" style={{ color: s.color }}>{s.stat}</div>
                                    <div className="text-white font-semibold text-lg">{s.label}</div>
                                    <div className="text-gray-400 text-sm mt-1">{s.sub}</div>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-gray-300 mt-8 text-base leading-relaxed">
                            Today, Taekwondo is recognized by the{' '}
                            <strong className="text-white">International Olympic Committee</strong> and is one
                            of the major global combat sports — having grown from its Korean roots into
                            a truly universal martial art.
                        </p>
                    </div>

                    <div className="h-1.5 bg-gradient-to-r from-[#138808] via-white to-[#FF9933]" />
                </motion.div>
            </motion.section>


            {/* ── Taekwondo in India (ITU's Story) ── */}
            <motion.section
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 relative z-10"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div variants={cardVariants}>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545] text-center mb-2">
                        Taekwondo in India & ITU's Story
                    </h2>
                    <div className="w-20 h-1 mx-auto mb-10 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

                    <div className="relative">
                        {/* Vertical accent line */}
                        <div className="hidden md:block absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-[#FF9933] via-[#0B2545] to-[#138808] rounded-full" />

                        <div className="space-y-8">
                            {indiaMilestones.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.09 }}
                                    className="relative flex gap-6 items-start"
                                >
                                    {/* Dot */}
                                    <div className="hidden md:flex flex-shrink-0 w-5 h-5 rounded-full mt-3 shadow-lg z-10"
                                        style={{ backgroundColor: m.color, marginLeft: '5px' }} />

                                    {/* Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-2xl shadow-lg p-6 flex-1 border-l-4 relative overflow-hidden"
                                        style={{ borderLeftColor: m.color }}
                                    >
                                        <motion.div variants={floatVariants} animate="float"
                                            className="absolute -bottom-6 -right-6 text-8xl"
                                            style={{ color: m.color, opacity: 0.06 }}>
                                            {m.icon}
                                        </motion.div>
                                        <div className="flex items-center gap-3 mb-3 relative z-10">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm shadow-md"
                                                style={{ backgroundColor: m.color }}>
                                                {m.icon}
                                            </div>
                                            <span className="font-bold text-sm px-3 py-1 rounded-full"
                                                style={{ backgroundColor: m.color + '18', color: m.color }}>
                                                {m.year}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#0B2545] mb-2 relative z-10">{m.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed relative z-10">{m.description}</p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* India's potential callout */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="rounded-xl p-6 border-l-4 border-[#FF9933] mt-10 bg-white shadow-lg"
                        style={{ borderLeftColor: '#FF9933' }}
                    >
                        <div className="flex items-start gap-4">
                            <FaFire className="text-3xl text-[#FF9933] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-[#0B2545] mb-2">India's Untapped Potential</h3>
                                <p className="text-gray-700 leading-relaxed text-sm">
                                    With 1.4 billion people and a growing culture of sports, India has the talent to become
                                    a dominant force in international Taekwondo. ITU's mission is to provide the platform,
                                    structure, and recognition to make that potential a reality.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.section>


            {/* ── Footer quote ── */}
            <motion.div
                className="text-center mt-8 pb-8 relative z-10"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            >
                <motion.div variants={pulseVariants} animate="pulse"
                    className="mx-auto w-28 h-1 rounded-full mb-6 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
                />
                <motion.h3 whileHover={{ scale: 1.02 }} className="text-2xl font-bold text-[#0B2545] mb-3">
                    जय हिंद, जय भारत
                </motion.h3>
                <motion.p whileHover={{ scale: 1.01 }} className="text-gray-500 max-w-xl mx-auto text-base">
                    Honoring the spirit of Taekwondo — discipline, respect, and excellence —
                    from ancient Korea to every corner of India.
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

export default HistoryOfTaekwondo;
