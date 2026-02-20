import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Shield, MapPin, Calendar, Search, X, ChevronLeft, ChevronRight,
    Star, Camera, User, Building2, AlertCircle, Loader, Filter, RotateCcw
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

/* ══════════════════════════════════════════
   DETAIL MODAL  –  full-screen popup
══════════════════════════════════════════ */
const DetailModal = ({ training, onClose }) => {
    const [slide, setSlide] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const timerRef = useRef(null);
    const photos = training.photos || [];
    const total = photos.length;

    /* auto-advance */
    useEffect(() => {
        if (total <= 1) return;
        timerRef.current = setInterval(() => setSlide(s => (s + 1) % total), 4000);
        return () => clearInterval(timerRef.current);
    }, [total]);

    const goPrev = () => { clearInterval(timerRef.current); setSlide(s => (s - 1 + total) % total); };
    const goNext = () => { clearInterval(timerRef.current); setSlide(s => (s + 1) % total); };

    /* keyboard */
    useEffect(() => {
        const fn = e => {
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [total]);

    /* swipe */
    const onPointerDown = e => { setDragging(true); setDragStart(e.clientX); };
    const onPointerUp = e => {
        if (!dragging) return;
        setDragging(false);
        const diff = e.clientX - dragStart;
        if (diff < -40) goNext();
        if (diff > 40) goPrev();
    };

    const fmt = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
            style={{ background: 'rgba(5,15,35,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 30 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                style={{ width: '100%', maxWidth: 860, maxHeight: '92vh' }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── SLIDER ── */}
                <div
                    className="relative select-none overflow-hidden flex-shrink-0"
                    style={{ height: '54vw', maxHeight: 400, minHeight: 200, background: '#0E2A4E' }}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    onPointerLeave={e => { if (dragging) { setDragging(false); } }}
                >
                    {total === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/30">
                            <Camera size={48} />
                            <p className="text-sm font-medium">No photos uploaded</p>
                        </div>
                    ) : (
                        <>
                            {/* Slide images */}
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.img
                                    key={slide}
                                    src={photos[slide].url}
                                    alt={photos[slide].altText || `Photo ${slide + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    initial={{ opacity: 0, x: 60 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -60 }}
                                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                                    draggable={false}
                                />
                            </AnimatePresence>

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                            {/* Nav arrows */}
                            {total > 1 && (
                                <>
                                    <button onClick={goPrev}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-orange-500 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={goNext}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-orange-500 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10">
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            {/* Dot indicators */}
                            {total > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {photos.map((_, i) => (
                                        <button key={i} onClick={() => setSlide(i)}
                                            className={`rounded-full transition-all duration-300 ${i === slide ? 'w-6 h-2 bg-orange-400' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Counter badge */}
                            <div className="absolute top-4 right-14 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm z-10">
                                {slide + 1} / {total}
                            </div>

                            {/* State badge */}
                            <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                                {training.state}
                            </div>
                        </>
                    )}

                    {/* Thumbnail strip */}
                    {total > 1 && (
                        <div className="absolute bottom-0 left-0 right-0 flex gap-1.5 p-2 overflow-x-auto scrollbar-hide justify-center"
                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                            {photos.map((p, i) => (
                                <button key={i} onClick={() => setSlide(i)}
                                    className={`flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === slide ? 'border-orange-400 scale-110' : 'border-white/30 opacity-70 hover:opacity-100'}`}>
                                    <img src={p.url} alt="" className="w-full h-full object-cover" draggable={false} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── DETAILS (scrollable) ── */}
                <div className="flex-1 overflow-y-auto">
                    {/* Close button */}
                    <button onClick={onClose}
                        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-red-500 text-white flex items-center justify-center transition-all backdrop-blur-sm">
                        <X size={18} />
                    </button>

                    <div className="p-5 sm:p-7">
                        {/* Title */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 leading-tight">
                                    <Building2 size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                                    {training.policeStation}
                                </h2>
                                <p className="text-gray-500 mt-1 flex items-center gap-1.5 text-sm">
                                    <MapPin size={14} className="text-orange-400" />
                                    {training.district}, {training.state}
                                </p>
                            </div>
                            <div className="flex-shrink-0 bg-orange-50 border border-orange-200 rounded-2xl px-3 py-2 text-center">
                                <p className="text-[10px] uppercase tracking-widest text-orange-500 font-bold">Photos</p>
                                <p className="text-2xl font-black text-orange-600">{total}</p>
                            </div>
                        </div>

                        {/* Meta chips */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-semibold border border-blue-100">
                                <Calendar size={12} /> {fmt(training.eventDate)}
                            </span>
                            {training.location && (
                                <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                                    <MapPin size={12} /> {training.location}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {training.description && (
                            <p className="text-sm text-gray-600 leading-relaxed mb-6 bg-gray-50 rounded-2xl px-4 py-3 border-l-4 border-orange-300">
                                {training.description}
                            </p>
                        )}

                        {/* Chief guest */}
                        {training.officerName && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 mb-2">
                                <p className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-widest mb-3">
                                    <Star size={13} className="fill-amber-500 text-amber-500" /> Chief Guest
                                </p>
                                <div className="flex items-center gap-4">
                                    {training.officerPhoto?.url ? (
                                        <img src={training.officerPhoto.url} alt={training.officerName}
                                            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-300 shadow-md flex-shrink-0" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center flex-shrink-0">
                                            <User size={32} className="text-amber-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-black text-gray-900">{training.officerName}</h4>
                                        {training.officerDesignation && (
                                            <p className="text-sm font-semibold text-orange-600">{training.officerDesignation}</p>
                                        )}
                                        {(training.officerDistrict || training.officerState) && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <MapPin size={11} /> {[training.officerDistrict, training.officerState].filter(Boolean).join(', ')}
                                            </p>
                                        )}
                                        {training.officerNote && (
                                            <p className="text-xs text-gray-600 italic mt-2 bg-amber-100/60 rounded-lg px-3 py-1.5">
                                                "{training.officerNote}"
                                            </p>
                                        )}
                                    </div>
                                    {training.momentoPhoto?.url && (
                                        <img src={training.momentoPhoto.url} alt="Momento"
                                            className="w-16 h-16 rounded-xl object-cover border-2 border-amber-200 shadow flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ══════════════════════════════════════════
   TRAINING CARD
══════════════════════════════════════════ */
const TrainingCard = ({ training, index, onClick }) => {
    const photos = training.photos || [];
    const thumb = photos[0]?.url;
    const fmt = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: (index % 3) * 0.07 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            onClick={onClick}
            className="group cursor-pointer rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-400 border border-gray-100/80"
        >
            {/* Thumbnail */}
            <div className="relative overflow-hidden" style={{ paddingTop: '62%' }}>
                {thumb ? (
                    <img src={thumb} alt={`${training.policeStation} training`}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0E2A4E] to-[#1a3c6b] flex items-center justify-center">
                        <Shield size={40} className="text-orange-400 opacity-50" />
                    </div>
                )}
                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Badges row */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span className="bg-orange-500 text-white text-[11px] font-black px-3 py-1 rounded-full tracking-wide shadow-lg">
                        {training.state}
                    </span>
                    {photos.length > 0 && (
                        <span className="flex items-center gap-1 bg-black/50 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                            <Camera size={11} /> {photos.length}
                        </span>
                    )}
                </div>

                {/* Bottom overlay info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-black text-base leading-snug drop-shadow-lg">
                        {training.policeStation}
                    </h3>
                    <p className="text-white/75 text-xs mt-0.5 flex items-center gap-1">
                        <MapPin size={11} /> {training.district}
                    </p>
                </div>

                {/* Play / view icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-orange-500/90 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Camera size={24} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Card body */}
            <div className="px-4 py-4">
                {/* Date & location */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                        <Calendar size={10} /> {fmt(training.eventDate)}
                    </span>
                    {training.location && (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                            <MapPin size={10} /> {training.location}
                        </span>
                    )}
                </div>

                {/* Description snippet */}
                {training.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {training.description}
                    </p>
                )}

                {/* Chief guest pill */}
                {training.officerName && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2">
                        {training.officerPhoto?.url ? (
                            <img src={training.officerPhoto.url} alt="" className="w-7 h-7 rounded-full object-cover border border-amber-300" />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center">
                                <User size={13} className="text-amber-600" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-[11px] font-black text-amber-700 truncate">{training.officerName}</p>
                            {training.officerDesignation && (
                                <p className="text-[10px] text-amber-500 truncate">{training.officerDesignation}</p>
                            )}
                        </div>
                        <Star size={11} className="text-amber-500 fill-amber-500 ml-auto flex-shrink-0" />
                    </div>
                )}

                {/* View CTA */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-medium">Click to view</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                        View Photos <ChevronRight size={14} />
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

/* ══════════════════════════════════════════
   HERO BANNER
══════════════════════════════════════════ */
const HeroBanner = () => (
    <div className="relative bg-[#0E2A4E] text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 pt-[130px] sm:pt-[140px] pb-16 px-4 max-w-6xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55 }}
                className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            >
                <Shield size={14} /> ITU Police Training Programme
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="text-4xl sm:text-6xl font-black mb-5 leading-tight tracking-tight"
            >
                Police Tactical{' '}
                <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                    Training
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="text-base sm:text-lg text-white/65 max-w-2xl mx-auto"
            >
                Empowering India's law enforcement with certified Taekwondo-based tactical training — district by district.
            </motion.p>

            {/* Stats strip */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.3 }}
                className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-12"
            >
                {[
                    { val: '1,200+', lbl: 'Officers Trained' },
                    { val: '18+', lbl: 'States Covered' },
                    { val: '50+', lbl: 'Certified Trainers' },
                ].map((s, i) => (
                    <div key={i} className="text-center">
                        <p className="text-3xl font-black text-white">{s.val}</p>
                        <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">{s.lbl}</p>
                    </div>
                ))}
            </motion.div>
        </div>

        {/* Wave */}
        <svg viewBox="0 0 1440 60" className="w-full" style={{ display: 'block', marginTop: -1 }}>
            <path d="M0 60L1440 60L1440 0C1200 55 960 60 720 40C480 20 240 5 0 30Z" fill="#f9fafb" />
        </svg>
    </div>
);

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
const PoliceTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCard, setActiveCard] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [stateList, setStateList] = useState([]);
    const [districtList, setDistrictList] = useState([]);

    const fetchTrainings = useCallback(async () => {
        try {
            setLoading(true); setError(null);
            const params = {};
            if (selectedState) params.state = selectedState;
            if (selectedDistrict) params.district = selectedDistrict;
            if (searchTerm) params.search = searchTerm;
            const res = await axios.get(API_ENDPOINTS.GET_POLICE_TRAININGS, { params });
            const data = res.data?.trainings || [];
            setTrainings(data);
            if (!selectedState && !selectedDistrict && !searchTerm) {
                setStateList([...new Set(data.map(t => t.state))].sort());
            }
        } catch {
            setError('Unable to load training data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [selectedState, selectedDistrict, searchTerm]);

    useEffect(() => { fetchTrainings(); }, [fetchTrainings]);

    useEffect(() => {
        if (!selectedState) { setSelectedDistrict(''); setDistrictList([]); return; }
        const ds = [...new Set(trainings.filter(t => t.state === selectedState).map(t => t.district))].sort();
        setDistrictList(ds); setSelectedDistrict('');
    }, [selectedState, trainings]);

    const clearFilters = () => { setSearchTerm(''); setSelectedState(''); setSelectedDistrict(''); };
    const hasFilters = searchTerm || selectedState || selectedDistrict;

    return (
        <div className="min-h-screen bg-gray-50">
            <HeroBanner />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* ── Filter bar ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-10"
                >
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search police station, officer…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && fetchTrainings()}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                        {/* State */}
                        <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-gray-50 min-w-[150px]">
                            <option value="">All States</option>
                            {stateList.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {/* District */}
                        <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}
                            disabled={!selectedState}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-gray-50 min-w-[150px] disabled:opacity-40 disabled:cursor-not-allowed">
                            <option value="">All Districts</option>
                            {districtList.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        {/* Buttons */}
                        <button onClick={fetchTrainings} disabled={loading}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50">
                            <Filter size={14} /> Search
                        </button>
                        <button onClick={fetchTrainings} disabled={loading}
                            className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm transition-colors disabled:opacity-50">
                            <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
                        </button>
                        {hasFilters && (
                            <button onClick={clearFilters}
                                className="flex items-center gap-1 px-4 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-sm transition-colors">
                                <X size={13} /> Clear
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* ── Section heading ── */}
                <div className="flex items-center justify-between mb-7">
                    <h2 className="text-xl font-black text-gray-900">
                        {loading ? 'Loading…' : `${trainings.length} Training Event${trainings.length !== 1 ? 's' : ''}`}
                    </h2>
                    {hasFilters && !loading && (
                        <p className="text-xs text-gray-400">
                            {selectedState && selectedState}{selectedDistrict && ` · ${selectedDistrict}`}{searchTerm && ` · "${searchTerm}"`}
                        </p>
                    )}
                </div>

                {/* ── States ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader size={36} className="animate-spin text-orange-500" />
                        <p className="text-sm text-gray-400">Loading training events…</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <AlertCircle size={48} className="mx-auto text-red-400 mb-3" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">Something went wrong</h3>
                        <p className="text-sm text-gray-400 mb-5">{error}</p>
                        <button onClick={fetchTrainings}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">
                            Retry
                        </button>
                    </div>
                ) : trainings.length === 0 ? (
                    <div className="text-center py-28 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <Camera size={52} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-bold text-gray-700 mb-2">No Training Events Found</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            {hasFilters ? 'No results match your filters.' : 'No events have been added yet.'}
                        </p>
                        {hasFilters && (
                            <button onClick={clearFilters}
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {trainings.map((t, i) => (
                            <TrainingCard key={t._id} training={t} index={i} onClick={() => setActiveCard(t)} />
                        ))}
                    </div>
                )}

                {/* ── Bottom CTA ── */}
                {!loading && !error && trainings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                        viewport={{ once: true }}
                        className="mt-16 bg-gradient-to-br from-[#0E2A4E] to-[#1a3c6b] rounded-3xl p-10 text-white text-center shadow-2xl"
                    >
                        <h3 className="text-2xl sm:text-3xl font-black mb-3">Want ITU Training in Your District?</h3>
                        <p className="text-white/60 text-sm mb-7 max-w-xl mx-auto">
                            Contact the Indian Taekwondo Union to organise a certified tactical training programme for police personnel in your district.
                        </p>
                        <a href="/contact"
                            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full text-sm shadow-lg transition-colors">
                            Contact Us
                        </a>
                    </motion.div>
                )}
            </div>

            {/* ── Detail Modal ── */}
            <AnimatePresence>
                {activeCard && (
                    <DetailModal training={activeCard} onClose={() => setActiveCard(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PoliceTraining;
