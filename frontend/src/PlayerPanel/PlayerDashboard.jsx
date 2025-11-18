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
  AlertCircle,
  Menu,
  X as XIcon,
  Newspaper,
  Trophy,
  ChevronRight,
  CreditCard
} from "lucide-react";
import { toast } from "react-toastify";
import PlayerIDCard from "./PlayerIDCard";
import PlayerBeltPromotionTests from "./PlayerBeltPromotionTests";
import { clearAuthData } from "../utils/auth";

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
  const [activeMenu, setActiveMenu] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newsList, setNewsList] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  // Helper function to get image URL (defined early so it can be used in useEffect)
  const getImageUrl = (image) => {
    if (!image) return null;
    // If it's already a full URL (Cloudinary or data URI), return as is
    if (/^(https?|data):/i.test(image)) return image;
    // If it's a Cloudinary URL without protocol (shouldn't happen, but just in case)
    if (image.includes('cloudinary.com')) return `https:${image}`;
    // Handle legacy uploads/ paths
    if (image.startsWith('uploads/')) return `${API_BASE_URL}/${image}`;
    const cleanImage = image.replace(/^\/+/, '');
    return `${API_BASE_URL}/uploads/${cleanImage}`;
  };

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
      
      // Set photo preview from localStorage data
      if (parsed.photo) {
        const photoUrl = getImageUrl(parsed.photo);
        setPhotoPreview(photoUrl);
        console.log("Initial photo from localStorage:", photoUrl);
      }
      
      // Fetch fresh profile data from server
      fetchPlayerProfile(parsed._id);
    } catch (error) {
      console.error("Error parsing player data:", error);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (activeMenu === 'events') {
      fetchNews();
    }
  }, [activeMenu]);

  const fetchPlayerProfile = async (playerId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_PLAYER_PROFILE(playerId));
      if (response.data.success) {
        const updatedPlayer = response.data.data;
        setPlayer(updatedPlayer);
        localStorage.setItem("playerData", JSON.stringify(updatedPlayer));
        
        // Update photo preview
        if (updatedPlayer.photo) {
          const photoUrl = getImageUrl(updatedPlayer.photo);
          setPhotoPreview(photoUrl);
          console.log("Player photo loaded from server:", photoUrl);
        } else {
          setPhotoPreview(null);
          console.log("No photo found for player in database");
        }
      }
    } catch (error) {
      console.error("Error fetching player profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      setLoadingNews(true);
      const response = await axios.get(API_ENDPOINTS.GET_ALL_NEWS);
      if (response.data.news) {
        setNewsList(response.data.news);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to load events/news");
    } finally {
      setLoadingNews(false);
    }
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
        
        // Immediately update player state with the response data
        if (response.data.data) {
          const updatedPlayer = response.data.data;
          setPlayer(updatedPlayer);
          localStorage.setItem("playerData", JSON.stringify(updatedPlayer));
          
          // Update photo preview with the new Cloudinary URL
          if (response.data.photoUrl || updatedPlayer.photo) {
            const photoUrl = response.data.photoUrl || updatedPlayer.photo;
            setPhotoPreview(photoUrl);
            console.log("Photo URL updated:", photoUrl);
          }
        }
        
        // Also fetch fresh data to ensure consistency
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

  const handleLogout = async () => {
    try {
      // Clear all auth data
      clearAuthData();
      
      // Optionally call backend logout endpoint
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
        (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');
      
      try {
        await axios.post(`${API_BASE_URL}/api/admin/logout`, {}, {
          withCredentials: true
        });
      } catch (err) {
        // Ignore logout errors, continue with client-side cleanup
        console.log('Logout endpoint error (ignored):', err);
      }
      
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to login even if logout fails
      clearAuthData();
      navigate("/login");
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
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
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {player.name}
                  </h3>
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
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Events & News</h2>
            
            {loadingNews ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading events...</span>
              </div>
            ) : selectedNews ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ChevronRight className="rotate-180" size={20} />
                  Back to Events
                </button>
                <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-6">
                  <img
                    src={getImageUrl(selectedNews.image)}
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedNews.title}</h3>
                <p className="text-gray-700 font-semibold mb-4">{selectedNews.content}</p>
                {selectedNews.moreContent && (
                  <div className="text-gray-600 whitespace-pre-line">{selectedNews.moreContent}</div>
                )}
                {selectedNews.author && (
                  <p className="text-sm text-gray-500 mt-4">By {selectedNews.author}</p>
                )}
              </div>
            ) : newsList.length > 0 ? (
              <>
                {newsList.length > 0 && (
                  <div
                    className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedNews(newsList[0])}
                  >
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={getImageUrl(newsList[0].image)}
                        alt="Featured News"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white text-2xl font-bold mb-2">{newsList[0].title}</h3>
                      <p className="text-gray-200">
                        {newsList[0].content.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newsList.slice(1).map((news) => (
                    <div
                      key={news._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setSelectedNews(news)}
                    >
                      <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={getImageUrl(news.image)}
                          alt={news.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{news.title}</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {news.content.substring(0, 100)}...
                        </p>
                        <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Read More →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Newspaper size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No events or news available at the moment.</p>
              </div>
            )}
          </div>
        );

      case 'belt-promotion':
        return <PlayerBeltPromotionTests playerId={player._id} />;

      case 'id-card':
        return <PlayerIDCard player={player} />;

      default:
        return null;
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-gray-900">Player Dashboard</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <XIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveMenu('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeMenu === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User size={20} />
            {sidebarOpen && <span>Profile</span>}
          </button>

          <button
            onClick={() => setActiveMenu('events')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeMenu === 'events'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Newspaper size={20} />
            {sidebarOpen && <span>Events</span>}
          </button>

          <button
            onClick={() => setActiveMenu('belt-promotion')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeMenu === 'belt-promotion'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Trophy size={20} />
            {sidebarOpen && <span>Belt Promotion</span>}
          </button>

          <button
            onClick={() => setActiveMenu('id-card')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeMenu === 'id-card'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CreditCard size={20} />
            {sidebarOpen && <span>ID Card</span>}
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white shadow-md">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeMenu === 'profile' ? 'Profile' : 
                 activeMenu === 'events' ? 'Events & News' : 
                 activeMenu === 'belt-promotion' ? 'Belt Promotion Tests' :
                 activeMenu === 'id-card' ? 'Player ID Card' : 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {player.name}</p>
            </div>
            <div className="flex items-center gap-4">
              {player.playerId && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Player ID</p>
                  <p className="text-sm font-semibold text-blue-600">{player.playerId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
