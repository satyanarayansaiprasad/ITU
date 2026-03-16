import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Download, 
  Settings, 
  Users, 
  Calendar, 
  MapPin, 
  Timer, 
  ToggleLeft, 
  ToggleRight, 
  Search,
  RefreshCcw
} from 'lucide-react';

const TaekwondoTestManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState({
    isActive: true,
    testDate: '',
    time: '',
    venue: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const getBaseUrl = () => {
    if (window.location.hostname === 'localhost') return 'http://localhost:3001';
    const envUrl = import.meta.env.VITE_API_BASE_URL || 'https://itu-r1qa.onrender.com';
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  };
  const API_BASE_URL = getBaseUrl();

  const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchSettings();
    fetchRegistrations();
  }, [API_BASE_URL]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/taekwondo-test/settings`);
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const header = getAuthHeader();
      if (!localStorage.getItem('accessToken')) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/taekwondo-test/admin/registrations`, header);
      if (response.data.success) {
        setRegistrations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to load registrations';
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      const response = await axios.put(`${API_BASE_URL}/api/taekwondo-test/admin/settings`, settings, getAuthHeader());
      if (response.data.success) {
        toast.success('Settings updated successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update settings';
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/taekwondo-test/admin/download`,
        {
          ...getAuthHeader(),
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `taekwondo_registrations_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV');
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg['Player Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg['Academy Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg['Transaction ID']?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" />
            Taekwondo Test Registrations
          </h2>
          <p className="text-gray-500 mt-1">Manage event settings and view student registrations.</p>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-green-100 font-semibold"
        >
          <Download size={20} />
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
              <Settings className="text-gray-500" size={20} />
              Event Controls
            </h3>
            
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Registration Status</span>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, isActive: !settings.isActive })}
                  className="transition-colors outline-none"
                >
                  {settings.isActive ? (
                    <ToggleRight size={40} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={40} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar size={14} className="text-blue-500" /> Test Date
                </label>
                <input
                  type="text"
                  value={settings.testDate}
                  onChange={(e) => setSettings({ ...settings, testDate: e.target.value })}
                  placeholder="e.g. 29th March, 2026 (Sunday)"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Timer size={14} className="text-blue-500" /> Event Time
                </label>
                <input
                  type="text"
                  value={settings.time}
                  onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                  placeholder="e.g. 9:30 Am to 1:30 Pm"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin size={14} className="text-blue-500" /> Venue Address
                </label>
                <textarea
                  value={settings.venue}
                  onChange={(e) => setSettings({ ...settings, venue: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {savingSettings ? 'Saving...' : 'Update Event Info'}
              </button>
            </form>
          </div>
        </div>

        {/* Data List Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, academy or transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button 
                onClick={fetchRegistrations}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Refresh registrations"
              >
                <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading registration data...</p>
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="py-20 text-center">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No registrations found.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Player Details</th>
                      <th className="px-6 py-4">Belt Test</th>
                      <th className="px-6 py-4">Transaction Details</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRegistrations.map((reg, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{reg['Player Name']}</div>
                          <div className="text-sm text-gray-500">{reg['Academy Name']}</div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Phone size={10} /> {reg['Phone Number']}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                            {reg['Belt Test']}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-mono text-gray-600">{reg['Transaction ID']}</div>
                          <div className="text-xs text-gray-400">DOB: {reg['DOB']}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-600">
                            {reg['Submitted At'] ? new Date(reg['Submitted At']).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {reg['Submitted At'] ? new Date(reg['Submitted At']).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaekwondoTestManagement;
