import React, { useState } from 'react';
import { 
  Trophy, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  Maximize2, 
  AlertCircle,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const NationalChampionshipRegistration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const registrationUrl = "https://www.dosportsglobal.com/event/9th-open-national-taekwondo-championship-2026-qptj";

  const handleReload = () => {
    setIsLoading(true);
    const iframe = document.getElementById('championship-iframe');
    if (iframe) {
      iframe.src = registrationUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#0B2545] via-[#13315C] to-[#134074] rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-6 sm:mb-8 relative overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-400/30 rounded-full text-orange-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
                <Sparkles size={14} /> Official Registration Portal
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Register for National Championship
              </h1>
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
                9th Open National Taekwondo Championship 2026. Complete your registration and submission directly below without leaving our website.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs sm:text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-green-400" /> Secure Portal
                </span>
                <span className="flex items-center gap-1.5">
                  <Trophy size={16} className="text-yellow-400" /> National Level Championship
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleReload}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                title="Refresh Form"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                <span>Refresh Form</span>
              </button>

              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span>Open in New Tab</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Iframe Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {/* Iframe Header Bar */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs sm:text-sm font-mono text-gray-500 ml-2 truncate max-w-xs sm:max-w-md md:max-w-xl">
                {registrationUrl}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="hidden sm:inline">Official Form Window</span>
              <a 
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:text-gray-700 transition-colors"
                title="Fullscreen / Direct Link"
              >
                <Maximize2 size={16} />
              </a>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-x-0 top-12 bottom-0 flex flex-col items-center justify-center bg-white/90 z-10 backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sm font-semibold text-gray-700">Loading Registration Portal...</p>
              <p className="text-xs text-gray-500 mt-1">Please wait while the registration page connects securely.</p>
            </div>
          )}

          {/* Embedded Iframe */}
          <div className="w-full relative" style={{ height: '85vh', minHeight: '650px' }}>
            <iframe
              id="championship-iframe"
              src={registrationUrl}
              title="Register for National Championship"
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              allow="payment; camera; microphone; geolocation; fullscreen"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation"
            />
          </div>

          {/* Footer Note */}
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <AlertCircle size={14} className="text-orange-500 flex-shrink-0" />
              <span>
                If you encounter any difficulty with the embedded window, you can also{" "}
                <a 
                  href={registrationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-600 underline font-medium hover:text-orange-700"
                >
                  open the registration portal in a new tab
                </a>.
              </span>
            </div>
            <div className="text-gray-400">
              Indian Taekwondo Union &bull; All Rights Reserved
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default NationalChampionshipRegistration;
