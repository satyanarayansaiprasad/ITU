import React, { useState } from 'react';
import axios from 'axios';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Search, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BELT_RANKS = [
  "White",
  "White One",
  "Yellow",
  "Yellow One",
  "Green",
  "Green One",
  "Blue",
  "Blue One",
  "Red",
  "Red One",
  "1st Dan Black Belt",
  "2nd Dan Black Belt",
  "3rd Dan Black Belt",
  "4th Dan Black Belt",
  "5th Dan Black Belt",
  "6th Dan Black Belt",
  "7th Dan Black Belt",
  "8th Dan Black Belt",
  "9th Dan Black Belt"
];

const VerifyCertificate = () => {
  const [ituId, setItuId] = useState('');
  const [beltRank, setBeltRank] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-f4bn.onrender.com');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ituId.trim() || !beltRank) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/verify-certificate`, {
        ituId: ituId.trim(),
        beltRank: beltRank
      });
      setResult(response.data);
    } catch (err) {
      console.error('Verification error:', err);
      const errorMsg = err.response?.data?.message || 'An error occurred during verification. Please check your network connection and try again.';
      setResult({
        success: false,
        status: err.response?.data?.status || 'ERROR',
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItuId('');
    setBeltRank('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B2545] via-[#13315C] to-[#0B2545] py-12 px-4 sm:px-6 lg:px-8 text-white flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl mb-4 backdrop-blur-md">
            <ShieldCheck className="w-10 h-10 text-orange-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent">
            Verify Player Certificate
          </h1>
          <p className="mt-3 text-base text-gray-300 max-w-lg mx-auto">
            Official Indian Taekwondo Union Certificate Authentication Portal. Enter the ITU ID and Belt Rank to verify authenticity.
          </p>
        </motion.div>

        {/* Main Verification Card */}
        <motion.div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ITU ID Field */}
            <div>
              <label htmlFor="ituId" className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" />
                ITU Player ID <span className="text-orange-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="ituId"
                  type="text"
                  value={ituId}
                  onChange={(e) => setItuId(e.target.value)}
                  placeholder="e.g. ITU12345678"
                  required
                  className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all uppercase tracking-wider font-semibold"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Enter the unique ITU ID printed on the player's certificate.</p>
            </div>

            {/* Belt Rank Select Field */}
            <div>
              <label htmlFor="beltRank" className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                Belt Rank Listed on Certificate <span className="text-orange-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="beltRank"
                  value={beltRank}
                  onChange={(e) => setBeltRank(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-[#0B2545] border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Belt Rank *</option>
                  {BELT_RANKS.map((rank) => (
                    <option key={rank} value={rank} className="bg-[#0B2545] text-white">
                      {rank}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Submit & Reset Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !ituId.trim() || !beltRank}
                className="flex-1 py-3.5 px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-orange-500/25 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Verify Certificate</span>
                  </>
                )}
              </button>

              {result && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3.5 px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>

          </form>

          {/* Result Presentation Card */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                {result.success ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-green-900/60 border border-emerald-500/40 shadow-xl backdrop-blur-md">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/40 flex-shrink-0 text-emerald-400">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                          {result.status === 'PROMOTED' ? 'Valid (Promoted)' : 'Official Verified Certificate'}
                        </span>
                        <p className="text-emerald-100 font-semibold text-lg leading-relaxed">
                          {result.message}
                        </p>
                        
                        {result.player && (
                          <div className="mt-4 pt-4 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-emerald-400/80 text-xs font-medium uppercase block">Player Name</span>
                              <span className="text-white font-bold text-base">{result.player.name}</span>
                            </div>
                            <div>
                              <span className="text-emerald-400/80 text-xs font-medium uppercase block">ITU ID</span>
                              <span className="text-white font-mono font-bold text-base">{result.player.ituId}</span>
                            </div>
                            <div>
                              <span className="text-emerald-400/80 text-xs font-medium uppercase block">Current Database Rank</span>
                              <span className="text-emerald-300 font-bold">{result.player.currentRank}</span>
                            </div>
                            {result.player.submittedRank && (
                              <div>
                                <span className="text-emerald-400/80 text-xs font-medium uppercase block">Certificate Rank</span>
                                <span className="text-emerald-200 font-medium">{result.player.submittedRank}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/80 to-rose-900/60 border border-red-500/40 shadow-xl backdrop-blur-md">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-red-500/20 rounded-xl border border-red-500/40 flex-shrink-0 text-red-400">
                        {result.status === 'RATE_LIMITED' ? (
                          <AlertTriangle className="w-8 h-8" />
                        ) : (
                          <XCircle className="w-8 h-8" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                          Verification Failed
                        </span>
                        <p className="text-red-100 font-semibold text-lg leading-relaxed">
                          {result.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Official Verification Portal &copy; {new Date().getFullYear()} Indian Taekwondo Union. All Rights Reserved.
        </p>

      </div>
    </div>
  );
};

export default VerifyCertificate;
