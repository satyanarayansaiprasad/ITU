import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "../config/api";
import { MapPin, User, Mail, Phone, Landmark, CheckCircle, AlertCircle, ChevronLeft, Plus, X, Calendar, Award, Clock } from "lucide-react";

const PlayerRegistrationForm = ({ onBack }) => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [players, setPlayers] = useState([
    {
      name: "",
      email: "",
      phone: "",
      address: "",
      dob: "",
      beltLevel: "",
      yearsOfExperience: ""
    }
  ]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_ALL_STATES);
        if (response.data.success) {
          setStates(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching states:', err);
      }
    };
    fetchStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (state) {
        setLoadingDistricts(true);
        try {
          const response = await axios.get(API_ENDPOINTS.GET_DISTRICTS(state));
          if (response.data.success) {
            setDistricts(response.data.data.districts || []);
          }
        } catch (err) {
          console.error('Error fetching districts:', err);
          setDistricts([]);
        } finally {
          setLoadingDistricts(false);
        }
      } else {
        setDistricts([]);
        setDistrict("");
      }
    };
    fetchDistricts();
  }, [state]);

  const handleStateChange = (e) => {
    setState(e.target.value);
    setDistrict(""); // Reset district when state changes
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  const addPlayer = () => {
    setPlayers([
      ...players,
      {
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        beltLevel: "",
        yearsOfExperience: ""
      }
    ]);
  };

  const removePlayer = (index) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = value;
    setPlayers(updatedPlayers);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate state and district
    if (!state || !district) {
      setError("Please select both State and District");
      setIsSubmitting(false);
      return;
    }

    // Validate all players
    const invalidPlayers = [];
    players.forEach((player, index) => {
      if (!player.name || !player.email || !player.phone || !player.address ||
          !player.dob || !player.beltLevel || !player.yearsOfExperience) {
        invalidPlayers.push(index + 1);
      }
    });

    if (invalidPlayers.length > 0) {
      setError(`Please fill all fields for player(s): ${invalidPlayers.join(", ")}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER_PLAYERS, {
        state,
        district,
        players
      });

      if (response.data.success) {
        setIsSubmitted(true);
        setPlayers([{
          name: "",
          email: "",
          phone: "",
          address: "",
          dob: "",
          beltLevel: "",
          yearsOfExperience: ""
        }]);
        setState("");
        setDistrict("");
      } else {
        setError(response.data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setError("One or more email addresses are already registered. Please use different emails.");
        } else if (error.response.data && error.response.data.errors) {
          setError(error.response.data.errors.join(", "));
        } else {
          setError(error.response.data?.error || "Registration failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-green-200 text-center"
      >
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Players Registered Successfully!
        </h2>
        <div className="space-y-4 text-left bg-green-50 p-4 rounded-lg">
          <p className="text-gray-700">
            <span className="font-semibold">What happens next:</span>
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Your player registrations have been received</li>
            <li>Administrators will review all player details</li>
            <li>Once approved, each player will receive a welcome email with their Player ID and password</li>
            <li>This may take 1-2 business days</li>
          </ul>
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            onBack();
          }}
          className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition"
        >
          Register More Players
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial="hidden"
      animate="visible"
      className="bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-orange-200"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-orange-600 hover:text-orange-800 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to form selection
        </button>
      )}

      <h2 className="text-2xl font-bold text-orange-700 mb-4">
        Player Registration - Multiple Players
      </h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4"
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* State and District Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
        <div className="relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
            <Landmark className="w-5 h-5 text-blue-600" />
          </div>
          <select
            name="state"
            value={state}
            onChange={handleStateChange}
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
            <MapPin className="w-5 h-5 text-green-700" />
          </div>
          <select
            name="district"
            value={district}
            onChange={handleDistrictChange}
            required
            disabled={!state || loadingDistricts}
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loadingDistricts ? "Loading districts..." : state ? "Select District" : "Select State first"}
            </option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Players List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Players ({players.length})
          </h3>
          <button
            type="button"
            onClick={addPlayer}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={16} />
            Add Player
          </button>
        </div>

        {players.map((player, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-700">
                Player {index + 1}
              </h4>
              {players.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePlayer(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={player.name}
                  onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
                  <Mail className="w-5 h-5 text-sky-600" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={player.email}
                  onChange={(e) => handlePlayerChange(index, "email", e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={player.phone}
                  onChange={(e) => handlePlayerChange(index, "phone", e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <input
                  type="date"
                  placeholder="Date of Birth *"
                  value={player.dob}
                  onChange={(e) => handlePlayerChange(index, "dob", e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <input
                  type="text"
                  placeholder="Belt Level *"
                  value={player.beltLevel}
                  onChange={(e) => handlePlayerChange(index, "beltLevel", e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <input
                  type="number"
                  placeholder="Years of Experience *"
                  value={player.yearsOfExperience}
                  onChange={(e) => handlePlayerChange(index, "yearsOfExperience", e.target.value)}
                  required
                  min="0"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="relative md:col-span-2">
                <div className="absolute top-3 left-3 z-10">
                  <MapPin className="w-5 h-5 text-green-700" />
                </div>
                <textarea
                  placeholder="Address *"
                  value={player.address}
                  onChange={(e) => handlePlayerChange(index, "address", e.target.value)}
                  required
                  rows={2}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        type="submit"
        disabled={isSubmitting || !state || !district}
        className={`w-full bg-gradient-to-r from-orange-500 to-green-600 text-white font-bold py-3 rounded-xl shadow-md transition duration-300 ${
          isSubmitting || !state || !district
            ? "opacity-70 cursor-not-allowed"
            : "hover:from-orange-600 hover:to-green-700"
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Registering {players.length} player(s)...
          </span>
        ) : (
          `Register ${players.length} Player(s)`
        )}
      </motion.button>
    </motion.form>
  );
};

export default PlayerRegistrationForm;

