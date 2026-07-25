import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Search, RefreshCw, Building2, Calendar, MapPin, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyAffiliation = () => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-f4bn.onrender.com');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/verify-affiliation`, {
        certificateId: certificateId.trim()
      });
      setResult(response.data);
    } catch (err) {
      console.error('Affiliation verification error:', err);
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
    setCertificateId('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B2545] via-[#13315C] to-[#0B2545] py-12 px-4 sm:px-6 lg:px-8 text-white flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl mb-4 backdrop-blur-md">
            <Building2 className="w-10 h-10 text-orange-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent">
            Verify Affiliation Certificate
          </h1>
          <p className="mt-3 text-base text-gray-300 max-w-lg mx-auto">
            Official Indian Taekwondo Union Affiliation Authentication Portal. Enter your Certificate ID to verify union / organization status.
          </p>
        </motion.div>

        {/* Verification Form Card */}
        <motion.div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Certificate ID Field */}
            <div>
              <label htmlFor="certificateId" className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" />
                Affiliation Certificate ID <span className="text-orange-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="certificateId"
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="e.g. ITU-6A2D7A40"
                  required
                  className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-mono uppercase tracking-wider font-semibold"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Enter the unique Certificate ID printed on your Union / Organization Affiliation Certificate (e.g. ITU-6A2D7A40).</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !certificateId.trim()}
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

          {/* Result Presentation */}
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
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-teal-950/90 border border-emerald-500/50 shadow-2xl backdrop-blur-md">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 flex-shrink-0 text-emerald-400">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-full mb-3 uppercase tracking-wide">
                          Verified Genuine Affiliation Certificate
                        </span>
                        
                        <p className="text-emerald-100 font-bold text-xl leading-relaxed">
                          {result.message}
                        </p>

                        {result.union && (
                          <div className="mt-5 pt-4 border-t border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-emerald-400/80 text-xs font-medium uppercase block">Union / Organization Name</span>
                              <span className="text-white font-bold text-base">{result.union.name}</span>
                            </div>
                            <div>
                              <span className="text-emerald-400/80 text-xs font-medium uppercase block">Certificate ID</span>
                              <span className="text-white font-mono font-semibold text-sm break-all">{result.union.certificateId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-400" />
                              <div>
                                <span className="text-emerald-400/80 text-xs font-medium uppercase block">State / Region</span>
                                <span className="text-emerald-200 font-semibold">{result.union.state} {result.union.district !== 'N/A' ? `(${result.union.district})` : ''}</span>
                              </div>
                            </div>
                            {result.union.presidentName !== 'N/A' && (
                              <div>
                                <span className="text-emerald-400/80 text-xs font-medium uppercase block">President / Representative</span>
                                <span className="text-emerald-200 font-semibold">{result.union.presidentName}</span>
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
          Official Affiliation Verification Portal &copy; {new Date().getFullYear()} Indian Taekwondo Union. All Rights Reserved.
        </p>

      </div>
    </div>
  );
};

export default VerifyAffiliation;
