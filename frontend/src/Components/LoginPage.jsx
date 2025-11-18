import { useState } from "react";
import React from 'react'; 
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { Lock, UserCog, UserPlus, Users, X, Eye, EyeOff } from "lucide-react";
import { setAuthData } from "../utils/auth";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

const LoginPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [loginType, setLoginType] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const endpointMap = {
        admin: API_ENDPOINTS.ADMIN_LOGIN,
        stateunion: API_ENDPOINTS.STATE_UNION_LOGIN,
        player: API_ENDPOINTS.PLAYER_LOGIN
      };

      const redirectMap = {
        admin: "/admindashboard",
        stateunion: "/stateuniondashboard",
        player: "/playerdashboard"
      };

      if (!endpointMap[loginType]) {
        setError("Invalid login type");
        return;
      }

      console.log("Sending login request:", {
        email: formData.email,
        type: loginType,
        endpoint: endpointMap[loginType]
      });

      const requestData = loginType === "player" 
        ? {
            playerId: formData.email.trim(), // Can be playerId or email
            password: formData.password
          }
        : {
            email: formData.email.trim().toLowerCase(),
            password: formData.password
          };

      const res = await axios.post(
        endpointMap[loginType],
        requestData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle successful login
      if (res.data?.success || res.status === 200) {
        // Extract tokens and user data
        const accessToken = res.data?.accessToken || res.data?.data?.accessToken;
        const refreshToken = res.data?.refreshToken || res.data?.data?.refreshToken;
        
        let userData = null;
        
        if (loginType === "admin") {
          userData = res.data?.data?.user || res.data;
        } else if (loginType === "stateunion") {
          // Check for rejection/pending
          if (res.data?.rejected) {
            throw new Error('Your registration has been rejected');
          }
          if (res.data?.status === 'pending') {
            throw new Error('Your registration is pending approval');
          }
          userData = res.data;
          // Remove password and tokens from userData
          const { password, accessToken: _, refreshToken: __, ...cleanData } = userData;
          userData = cleanData;
        } else if (loginType === "player") {
          userData = res.data?.data || res.data;
          // Remove password and tokens from userData
          const { password, accessToken: _, refreshToken: __, ...cleanData } = userData;
          userData = cleanData;
        }

        // Store tokens and user data
        if (accessToken) {
          setAuthData(accessToken, refreshToken, userData);
        } else {
          // Fallback: store user data for backward compatibility
          if (loginType === "stateunion" && res.data?._id) {
            localStorage.setItem('stateUnionId', res.data._id);
          }
          if (loginType === "player" && userData) {
            localStorage.setItem('playerData', JSON.stringify(userData));
          }
        }
      }

      navigate(redirectMap[loginType]);
      
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      errorMessage;
        
        console.error("Login error response:", {
          status: err.response.status,
          data: err.response.data
        });
      } else {
        console.error("Login error:", err);
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-10 backdrop-blur-sm">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <button onClick={() => navigate("/")}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="p-8">
                {!loginType ? (
                  <>
                    <div className="text-center mb-8">
                      <Lock size={48} className="mx-auto text-[#0B2545] mb-4" />
                      <h2 className="text-3xl font-bold text-[#0B2545]">Welcome Back</h2>
                      <p className="text-gray-500 mt-2">Please select your login type</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <motion.button
                        onClick={() => setLoginType("admin")}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0B2545] to-[#13315C] text-white rounded-lg hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserCog size={24} />
                        <span className="font-medium">Admin Login</span>
                      </motion.button>

                      <motion.button
                        onClick={() => setLoginType("stateunion")}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0B2545] to-[#13315C] text-white rounded-lg hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserPlus size={24} />
                        <span className="font-medium">Organization Login</span>
                      </motion.button>

                      <motion.button
                        onClick={() => setLoginType("player")}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0B2545] to-[#13315C] text-white rounded-lg hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Users size={24} />
                        <span className="font-medium">Player Login</span>
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="mx-auto mb-4 flex items-center justify-center">
                        {loginType === "admin" && <UserCog size={48} className="text-[#0B2545]" />}
                        {loginType === "stateunion" && <UserPlus size={48} className="text-[#0B2545]" />}
                        {loginType === "player" && <Users size={48} className="text-[#0B2545]" />}
                      </div>
                      <h2 className="text-3xl font-bold text-[#0B2545]">
                        {loginType === "stateunion" ? "Organization" : loginType.charAt(0).toUpperCase() + loginType.slice(1)} Login
                      </h2>
                      {loginType === "stateunion" && (
                        <p className="text-sm text-gray-500 mt-2">
                          For State Unions, Districts & Academies
                        </p>
                      )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg text-sm ${
                            error.includes('rejected') || error.includes('pending') 
                              ? 'bg-yellow-50 text-yellow-600' 
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {error}
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          {loginType === "stateunion" 
                            ? "Organization Email" 
                            : loginType === "player"
                            ? "Player ID or Email"
                            : "Email"}
                        </label>
                        <input
                          type={loginType === "player" ? "text" : "email"}
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-all"
                          placeholder={
                            loginType === "stateunion" 
                              ? "Enter your organization email" 
                              : loginType === "player"
                              ? "Enter your Player ID or Email"
                              : "Enter your email"}
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-all pr-10"
                            placeholder={`Enter your ${loginType === "stateunion" ? "organization password" : "password"}`}
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {loginType === "stateunion" && (
                          <p className="text-xs text-gray-500 mt-2">
                            Contact your administrator if you've forgotten your password
                          </p>
                        )}
                      </motion.div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#0B2545] to-[#13315C] text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        whileHover={{ y: isLoading ? 0 : -2 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      >
                        {isLoading ? (
                          <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging in...
                          </span>
                        ) : "Login"}
                      </motion.button>
                    </form>

                    <motion.button
                      onClick={() => {
                        setLoginType(null);
                        setError("");
                        setFormData({ email: "", password: "" });
                      }}
                      className="mt-6 w-full py-2 px-4 border border-[#0B2545] text-[#0B2545] font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      whileHover={{ y: -2 }}
                      disabled={isLoading}
                    >
                      <X size={18} />
                      <span>Back to login options</span>
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;