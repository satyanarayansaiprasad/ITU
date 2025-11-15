import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Search, User, Mail, Phone, Award, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const StateUnionDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('profile');
  const [players, setPlayers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalPlayers: 0, limit: 10 });
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [secretaryImagePreview, setSecretaryImagePreview] = useState(null);
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  
  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/${imagePath}`;
  };
  
  // Get user ID from URL params or localStorage
  const userId = paramId || localStorage.getItem('stateUnionId');

  useEffect(() => {
    if (!userId) {
      alert('User ID not found. Please login again.');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/user/stateunions/${userId}`);
        setProfileData(response.data.data);
        setLoading(false);
      } catch (error) {
        alert('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  // Fetch players when menu changes to players or when search/page changes
  useEffect(() => {
    const fetchPlayers = async () => {
      if (activeMenu === 'players' && userId) {
        setLoadingPlayers(true);
        try {
          const response = await axios.get(API_ENDPOINTS.GET_PLAYERS_BY_UNION(userId), {
            params: {
              status: 'approved',
              search: searchTerm,
              page: currentPage,
              limit: 10
            }
          });
          if (response.data.success) {
            setPlayers(response.data.data || []);
            setPagination(response.data.pagination || { currentPage: 1, totalPages: 1, totalPlayers: 0, limit: 10 });
          }
        } catch (error) {
          console.error('Error fetching players:', error);
          setPlayers([]);
        } finally {
          setLoadingPlayers(false);
        }
      }
    };

    fetchPlayers();
  }, [activeMenu, userId, searchTerm, currentPage]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    
    // Don't allow updating state and district - they're read-only
    delete values.state;
    delete values.district;
    
    try {
      // Convert establishedYear to establishedDate format (YYYY-01-01)
      if (values.establishedYear) {
        values.establishedDate = `${values.establishedYear}-01-01`;
        delete values.establishedYear;
      }
      
      // Auto-append "UNION" to organization name if not present
      if (values.organizationName) {
        const orgName = values.organizationName.trim();
        if (orgName && !orgName.toUpperCase().endsWith('UNION')) {
          values.name = `${orgName} UNION`;
        } else {
          values.name = orgName;
        }
        delete values.organizationName;
      }
      
      const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/user/stateunions/${userId}`, values);
      // Refresh profile data to ensure all fields are up to date
      const profileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/user/stateunions/${userId}`);
      setProfileData(profileResponse.data.data);
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    const formData = new FormData();
    formData.append('logo', file);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/user/stateunions/${userId}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Refresh profile data to get updated image URL
        const profileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/user/stateunions/${userId}`);
        setProfileData(profileResponse.data.data);
        setLogoPreview(null);
        alert('Logo uploaded successfully');
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      setLogoPreview(null);
      alert(`Failed to upload logo: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    }
  };

  const handleGeneralSecretaryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSecretaryImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    const formData = new FormData();
    formData.append('generalSecretaryImage', file);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/user/stateunions/${userId}/general-secretary-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Refresh profile data to get updated image URL
        const profileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/user/stateunions/${userId}`);
        setProfileData(profileResponse.data.data);
        setSecretaryImagePreview(null);
        alert('Secretary image uploaded successfully');
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Secretary image upload error:', error);
      setSecretaryImagePreview(null);
      alert(`Failed to upload Secretary image: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('stateUnionId');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{isEditing ? 'Update Profile' : 'View Profile'}</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input 
                      type="text" 
                      name="state" 
                      value={profileData?.state || ''} 
                      disabled
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" 
                    />
                    <p className="text-xs text-gray-500 mt-1">This field cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <input 
                      type="text" 
                      name="district" 
                      value={profileData?.district || ''} 
                      disabled
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">This field cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="text" 
                      name="phone" 
                      defaultValue={profileData?.phone} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      defaultValue={profileData?.address} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">President Name</label>
                    <input 
                      type="text" 
                      name="presidentName" 
                      defaultValue={profileData?.presidentName} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                    <input 
                      type="number" 
                      name="establishedYear" 
                      min="1900"
                      max={new Date().getFullYear()}
                      defaultValue={profileData?.establishedDate ? new Date(profileData.establishedDate).getFullYear() : ''} 
                      placeholder="YYYY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input 
                    type="text" 
                    name="organizationName" 
                    defaultValue={profileData?.name ? profileData.name.replace(/\s+UNION$/i, '') : ''} 
                    placeholder="e.g., GODDA DISTRICT TAEKWONDO"
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">"UNION" will be automatically added at the end</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <input 
                    type="file" 
                    onChange={handleLogoUpload} 
                    accept="image/*" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="mt-2">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="h-32 w-auto rounded-lg object-cover border-2 border-blue-500 shadow-md" 
                      />
                    ) : profileData?.logo ? (
                      <img 
                        src={getImageUrl(profileData.logo)} 
                        alt="Union Logo" 
                        className="h-32 w-auto rounded-lg object-cover border-2 border-gray-300" 
                        onError={(e) => {
                          console.error('Logo image error:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secretary Image</label>
                  <input 
                    type="file" 
                    onChange={handleGeneralSecretaryImageUpload} 
                    accept="image/*" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="mt-2">
                    {secretaryImagePreview ? (
                      <img 
                        src={secretaryImagePreview} 
                        alt="Secretary Preview" 
                        className="h-32 w-auto rounded-lg object-cover border-2 border-blue-500 shadow-md" 
                      />
                    ) : profileData?.generalSecretaryImage ? (
                      <img 
                        src={getImageUrl(profileData.generalSecretaryImage)} 
                        alt="Secretary" 
                        className="h-32 w-auto rounded-lg object-cover border-2 border-gray-300" 
                        onError={(e) => {
                          console.error('Secretary image error:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Profile
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-b pb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">State</p>
                    <p className="text-lg font-semibold">{profileData?.state || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">District</p>
                    <p className="text-lg font-semibold">{profileData?.district || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Organization Name</p>
                    <p className="text-lg font-semibold">{profileData?.name || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                    <p className="text-lg font-semibold">{profileData?.phone || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                    <p className="text-lg font-semibold">{profileData?.address || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">President Name</p>
                    <p className="text-lg font-semibold">{profileData?.presidentName || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Established Year</p>
                    <p className="text-lg font-semibold">
                      {profileData?.establishedDate ? new Date(profileData.establishedDate).getFullYear() : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${profileData?.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {profileData?.status?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>
                
                {profileData?.logo && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Logo</p>
                    <img 
                      src={getImageUrl(profileData.logo)} 
                      alt="Union Logo" 
                      className="h-32 rounded-lg shadow-md object-cover" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {profileData?.generalSecretaryImage && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Secretary Image</p>
                    <img 
                      src={getImageUrl(profileData.generalSecretaryImage)} 
                      alt="Secretary" 
                      className="h-32 rounded-lg shadow-md object-cover" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'players':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-bold mb-4 md:mb-0">Approved Players</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, belt..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {loadingPlayers ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading players...</span>
              </div>
            ) : players.length === 0 ? (
              <div className="text-center py-12">
                <User size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? 'No players found matching your search' : 'No approved players yet'}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, pagination.totalPlayers)} of {pagination.totalPlayers} players
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Belt Level</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {players.map(player => (
                        <tr key={player._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {player.photo ? (
                                <img
                                  src={player.photo.startsWith('http') ? player.photo : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/${player.photo}`}
                                  alt={player.name}
                                  className="h-10 w-10 rounded-full mr-3 object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  <User size={20} className="text-gray-400" />
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-900">{player.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{player.playerId || 'N/A'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{player.email}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{player.phone}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {player.beltLevel}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{player.yearsOfExperience} years</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {player.dob ? new Date(player.dob).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                        disabled={currentPage === pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      
      case 'achievements':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Achievements</h2>
            <div className="border border-gray-200 rounded-md p-4">
              <p>Achievement management feature will be available soon</p>
            </div>
          </div>
        );
      
      case 'events':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Events</h2>
            <div className="border border-gray-200 rounded-md p-4">
              <p>Event management feature will be available soon</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            {loading ? (
              <p>Loading...</p>
            ) : profileData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">Union Name</p>
                  <p className="text-lg">{profileData.name}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">State</p>
                  <p className="text-lg">{profileData.state}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${profileData.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {profileData.status.toUpperCase()}
                  </span>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">President</p>
                  <p className="text-lg">{profileData.presidentName || 'N/A'}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">Established Year</p>
                  <p className="text-lg">
                    {profileData.establishedDate ? new Date(profileData.establishedDate).getFullYear() : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-blue-800 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col relative`}>
        <div className={`h-16 flex items-center justify-center border-b border-blue-700 ${collapsed ? 'text-xl' : 'text-2xl'} font-bold`}>
          {collapsed ? 'UM' : 'Union member'}
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            <li>
              <button
                onClick={() => setActiveMenu('dashboard')}
                className={`w-full flex items-center p-3 rounded-md ${activeMenu === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                <span className="mr-3">🏠</span>
                {!collapsed && <span>Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('profile')}
                className={`w-full flex items-center p-3 rounded-md ${activeMenu === 'profile' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                <span className="mr-3">👤</span>
                {!collapsed && <span>Update Profile</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('players')}
                className={`w-full flex items-center p-3 rounded-md ${activeMenu === 'players' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                <span className="mr-3">👥</span>
                {!collapsed && <span>Approved Players</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('achievements')}
                className={`w-full flex items-center p-3 rounded-md ${activeMenu === 'achievements' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                <span className="mr-3">🏆</span>
                {!collapsed && <span>Achievements</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('events')}
                className={`w-full flex items-center p-3 rounded-md ${activeMenu === 'events' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                <span className="mr-3">📅</span>
                {!collapsed && <span>Events</span>}
              </button>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-md hover:bg-blue-700 mt-auto mb-4"
        >
          <span className="mr-3">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 bg-blue-800 text-white w-6 h-12 rounded-r-md flex items-center justify-center shadow-md"
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          {/* Header content */}
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StateUnionDashboard;