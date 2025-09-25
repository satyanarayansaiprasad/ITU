import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StateUnionDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('profile');
  const [players, setPlayers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/stateunions/${id}`);
        setProfileData(response.data.data);
        setLoading(false);
      } catch (error) {
        alert('Failed to fetch profile data');
        setLoading(false);
      }
    };

    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/api/players', {
          params: { status: 'approved', state: profileData?.state }
        });
        setPlayers(response.data.data);
      } catch (error) {
        alert('Failed to fetch players data');
      }
    };

    fetchProfile();
    if (activeMenu === 'players') {
      fetchPlayers();
    }
  }, [id, activeMenu, profileData?.state]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    
    try {
      const response = await axios.patch(`/api/stateunions/${id}`, values);
      setProfileData(response.data.data);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('logo', file);
    
    try {
      const response = await axios.post(`/api/stateunions/${id}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfileData({ ...profileData, logo: response.data.logoUrl });
      alert('Logo uploaded successfully');
    } catch (error) {
      alert('Failed to upload logo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input 
                      type="text" 
                      name="state" 
                      defaultValue={profileData?.state} 
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Union Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={profileData?.name} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secretary Name</label>
                    <input 
                      type="text" 
                      name="secretaryName" 
                      defaultValue={profileData?.secretaryName} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Director Name</label>
                    <input 
                      type="text" 
                      name="directorName" 
                      defaultValue={profileData?.directorName} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Established Date</label>
                    <input 
                      type="date" 
                      name="establishedDate" 
                      defaultValue={profileData?.establishedDate?.split('T')[0]} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Head Office Address</label>
                    <input 
                      type="text" 
                      name="headOfficeAddress" 
                      defaultValue={profileData?.headOfficeAddress} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input 
                      type="text" 
                      name="contactPhone" 
                      defaultValue={profileData?.contactPhone} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Official Website</label>
                    <input 
                      type="text" 
                      name="officialWebsite" 
                      defaultValue={profileData?.officialWebsite} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About Union</label>
                  <textarea 
                    name="aboutUnion" 
                    rows="4"
                    defaultValue={profileData?.aboutUnion} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <input 
                    type="file" 
                    onChange={handleLogoUpload} 
                    accept="image/*" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {profileData?.logo && (
                    <img 
                      src={profileData.logo} 
                      alt="Union Logo" 
                      className="mt-2 h-24" 
                    />
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Profile
                </button>
              </form>
            )}
          </div>
        );
      
      case 'players':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Approved Players</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map(player => (
                      <tr key={player._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${player.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {player.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  <p className="text-sm font-medium text-gray-500">Established Date</p>
                  <p className="text-lg">
                    {profileData.establishedDate ? new Date(profileData.establishedDate).toLocaleDateString() : 'N/A'}
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
          {collapsed ? 'SU' : 'State Union'}
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