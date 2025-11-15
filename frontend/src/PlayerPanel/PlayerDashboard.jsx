import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_ENDPOINTS } from "../config/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  Camera,
  Save,
  Edit2,
  LogOut,
  Upload,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const playerData = localStorage.getItem("playerData");
    if (!playerData) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(playerData);
      setPlayer(parsed);
      setFormData({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        address: parsed.address || "",
        dob: parsed.dob ? new Date(parsed.dob).toISOString().split('T')[0] : "",
        beltLevel: parsed.beltLevel || "",
        yearsOfExperience: parsed.yearsOfExperience || ""
      });
      if (parsed.photo) {
        setPhotoPreview(getImageUrl(parsed.photo));
      }
      fetchPlayerProfile(parsed._id);
    } catch (error) {
      console.error("Error parsing player data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchPlayerProfile = async (playerId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_PLAYER_PROFILE(playerId));
      if (response.data.success) {
        const updatedPlayer = response.data.data;
        setPlayer(updatedPlayer);
        localStorage.setItem("playerData", JSON.stringify(updatedPlayer));
        if (updatedPlayer.photo) {
          setPhotoPreview(getImageUrl(updatedPlayer.photo));
        }
      }
    } catch (error) {
      console.error("Error fetching player profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (/^(https?|data):/i.test(image)) return image;
    if (image.startsWith('uploads/')) return `${API_BASE_URL}/${image}`;
    const cleanImage = image.replace(/^\/+/, '');
    return `${API_BASE_URL}/uploads/${cleanImage}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhoto || !player) return;

    try {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append('photo', selectedPhoto);

      const response = await axios.post(
        API_ENDPOINTS.UPLOAD_PLAYER_PHOTO(player._id),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        toast.success("Photo uploaded successfully!");
        setSelectedPhoto(null);
        await fetchPlayerProfile(player._id);
      } else {
        toast.error("Failed to upload photo");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error(error.response?.data?.error || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!player) return;

    try {
      const response = await axios.patch(
        API_ENDPOINTS.UPDATE_PLAYER_PROFILE(player._id),
        formData
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        await fetchPlayerProfile(player._id);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("playerData");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Player Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-8 border-b">
            {/* Photo Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-500">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                    <Camera size={18} />
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                  {selectedPhoto && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {uploadingPhoto ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Upload
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPhoto(null);
                          setPhotoPreview(getImageUrl(player.photo));
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {player.name}
              </h2>
              {player.playerId && (
                <p className="text-lg text-gray-600 mb-4">
                  Player ID: <span className="font-semibold text-blue-600">{player.playerId}</span>
                </p>
              )}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    player.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {player.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline mr-2" size={16} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{player.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline mr-2" size={16} />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{player.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline mr-2" size={16} />
                  Location
                </label>
                <p className="text-gray-900">
                  {player.district}, {player.state}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline mr-2" size={16} />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{player.address}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline mr-2" size={16} />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {player.dob ? new Date(player.dob).toLocaleDateString() : "N/A"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Award className="inline mr-2" size={16} />
                  Belt Level
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="beltLevel"
                    value={formData.beltLevel}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{player.beltLevel}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline mr-2" size={16} />
                  Years of Experience
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{player.yearsOfExperience} years</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: player.name || "",
                    email: player.email || "",
                    phone: player.phone || "",
                    address: player.address || "",
                    dob: player.dob ? new Date(player.dob).toISOString().split('T')[0] : "",
                    beltLevel: player.beltLevel || "",
                    yearsOfExperience: player.yearsOfExperience || ""
                  });
                  setSelectedPhoto(null);
                  setPhotoPreview(getImageUrl(player.photo));
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PlayerDashboard;

