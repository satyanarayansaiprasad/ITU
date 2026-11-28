import React, { useState } from 'react';
import { 
  Trophy, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const NationalChampionshipRegistration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const registrationUrl = "https://www.dosportsglobal.com/event/9th-open-national-taekwondo-championship-2026-qptj";

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner - Centered, matching user specifications */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0B2545] rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden text-center"
        >
          {/* Subtle glowing accents */}
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 border border-orange-400/40 rounded-full text-orange-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              <Sparkles size={14} className="text-orange-400" /> OFFICIAL REGISTRATION PORTAL
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Register for National Championship
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              9th Open National Taekwondo Championship 2026. Complete your registration and submission directly below without leaving our website.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-1 text-xs sm:text-sm text-gray-300">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={16} className="text-emerald-400" /> Secure Portal
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Trophy size={16} className="text-yellow-400" /> National Level Championship
              </span>
            </div>
          </div>
        </motion.div>

        {/* Clean Iframe Frame without address bar, buttons, or external links */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sm font-semibold text-gray-700">Loading Registration Portal...</p>
              <p className="text-xs text-gray-400 mt-1">Please wait a moment while the portal connects.</p>
            </div>
          )}

          {/* Embedded Registration Portal */}
          <div className="w-full relative" style={{ height: '90vh', minHeight: '750px' }}>
            <iframe
              id="championship-iframe"
              src={registrationUrl}
              title="Register for National Championship"
              className="w-full h-full border-0 block"
              onLoad={() => setIsLoading(false)}
              allow="payment; camera; microphone; geolocation; fullscreen"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default NationalChampionshipRegistration;
