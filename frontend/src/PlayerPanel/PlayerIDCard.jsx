import React, { useRef, useState } from 'react';
import { RotateCcw, RotateCw, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const PlayerIDCard = ({ player }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (/^(https?|data):/i.test(image)) return image;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                        (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');
    if (image.startsWith('uploads/')) return `${API_BASE_URL}/${image}`;
    const cleanImage = image.replace(/^\/+/, '');
    return `${API_BASE_URL}/uploads/${cleanImage}`;
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="text-blue-600" size={24} />
            Player ID Card
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Premium 3D ID Card - View front and back</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            {isFlipped ? (
              <>
                <RotateCcw size={16} />
                <span>View Front</span>
              </>
            ) : (
              <>
                <RotateCw size={16} />
                <span>View Back</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3D Card Container */}
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] perspective-1000 px-2 sm:px-4">
        <div
          ref={cardRef}
          className="relative w-full max-w-[90vw] sm:max-w-[450px] md:max-w-[525px] h-[280px] sm:h-[300px] md:h-[330px] preserve-3d"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)',
          }}
        >
          {/* Front Side */}
          <div
            ref={frontRef}
            className="absolute inset-0 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              {/* Premium Gradient Background */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af, #312e81)' }}>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full p-3 sm:p-4 md:p-6 flex flex-col">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm p-1 sm:p-1.5 md:p-2 border-2 border-white/30 flex-shrink-0">
                      <img
                        src="/ITU LOGO.png"
                        alt="ITU Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight truncate">INDIAN TAEKWONDO</h3>
                      <h3 className="text-orange-400 font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight truncate">UNION</h3>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-white/80 text-[10px] sm:text-xs font-semibold whitespace-nowrap">PLAYER ID CARD</p>
                    <p className="text-orange-400 text-[10px] sm:text-xs font-bold mt-0.5 sm:mt-1 truncate max-w-[80px] sm:max-w-none">{player.playerId || 'N/A'}</p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 md:gap-6 min-h-0">
                  {/* Photo Section */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-28 sm:w-28 sm:h-36 md:w-32 md:h-40 rounded-lg overflow-hidden border-2 md:border-4 border-white/50 shadow-xl bg-white/10 backdrop-blur-sm">
                      {player.photo ? (
                        <img
                          src={getImageUrl(player.photo)}
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center" style={{ display: player.photo ? 'none' : 'flex' }}>
                        <span className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">{player.name.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0 w-full sm:w-auto">
                    <div>
                      <p className="text-white/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wide">Name</p>
                      <p className="text-white font-bold text-base sm:text-lg md:text-xl truncate">{player.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4">
                      <div className="min-w-0">
                        <p className="text-white/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wide">State</p>
                        <p className="text-white font-semibold text-xs sm:text-sm md:text-base truncate">{player.state}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wide">District</p>
                        <p className="text-white font-semibold text-xs sm:text-sm md:text-base truncate">{player.district}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-3">
                      <p className="text-white/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wide">Union</p>
                      <p className="text-white font-semibold text-xs sm:text-sm truncate">{player.unionName || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center pt-2 sm:pt-3 border-t border-white/20 mt-auto">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] sm:text-xs font-bold">ITU</span>
                    </div>
                    <p className="text-white/80 text-[10px] sm:text-xs">Official Player</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div
            ref={backRef}
            className="absolute inset-0 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              {/* Premium Gradient Background */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #312e81, #1e40af, #1e3a8a)' }}>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full p-3 sm:p-4 md:p-5 flex flex-col">
                {/* Header */}
                <div className="text-center mb-2 sm:mb-3 md:mb-4">
                  <div className="inline-block mb-1 sm:mb-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm p-1 sm:p-1.5 md:p-2 border-2 border-white/30 mx-auto">
                      <img
                        src="/ITU LOGO.png"
                        alt="ITU Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 px-2">INDIAN TAEKWONDO UNION</h3>
                  <p className="text-orange-400 text-[10px] sm:text-xs font-semibold px-2">Official Player Identification Card</p>
                </div>

                {/* Player Details - No Boxes */}
                <div className="flex-1 space-y-2 sm:space-y-3 px-1 sm:px-2 overflow-y-auto min-h-0">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div className="min-w-0">
                      <p className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-0.5 sm:mb-1">Date of Birth</p>
                      <p className="text-white font-bold text-xs sm:text-sm break-words">{formatDate(player.dob)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-0.5 sm:mb-1">Belt Level</p>
                      <p className="text-white font-bold text-xs sm:text-sm truncate">{player.beltLevel || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div className="min-w-0">
                      <p className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-0.5 sm:mb-1">Email</p>
                      <p className="text-white font-semibold text-[10px] sm:text-xs break-words leading-tight">{player.email || 'N/A'}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-0.5 sm:mb-1">Phone</p>
                      <p className="text-white font-semibold text-xs sm:text-sm break-words">{player.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Footer - Minimal */}
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-white/40 text-[9px] sm:text-[10px] md:text-xs px-2">This card is the property of Indian Taekwondo Union</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
        @media (max-width: 640px) {
          .perspective-1000 {
            perspective: 800px;
          }
        }
      `}</style>
    </div>
  );
};

export default PlayerIDCard;

