import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import {
  Crown,
  MapPin,
  Building2,
  Phone,
  Mail,
  Search,
  CheckCircle,
  X,
  Loader,
  AlertCircle,
  User,
  Award
} from 'lucide-react';

const HeadsManagement = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
      fetchOrganizations(selectedState);
    }
  }, [selectedState]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_ALL_STATES);
      if (response.data.success) {
        setStates(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      showNotification('Failed to fetch states', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (stateName) => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_DISTRICTS(stateName));
      if (response.data.success) {
        setDistricts(response.data.data.districts || []);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchOrganizations = async (stateName) => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_ORGANIZATIONS_BY_STATE(stateName));
      if (response.data.success) {
        setOrganizations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      showNotification('Failed to fetch organizations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDistrictHead = async (organizationId, district, state) => {
    if (!window.confirm(`Are you sure you want to set this organization as the head of ${district} district?`)) {
      return;
    }

    try {
      setActionLoading(organizationId);
      const response = await axios.post(API_ENDPOINTS.SET_DISTRICT_HEAD, {
        organizationId,
        district,
        state
      });

      if (response.data.success) {
        showNotification(`District head set successfully for ${district}`, 'success');
        fetchOrganizations(state);
      }
    } catch (error) {
      console.error('Error setting district head:', error);
      showNotification(error.response?.data?.error || 'Failed to set district head', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetStateHead = async (organizationId, state) => {
    if (!window.confirm(`Are you sure you want to set this organization as the head of ${state} state?`)) {
      return;
    }

    try {
      setActionLoading(`state-${organizationId}`);
      const response = await axios.post(API_ENDPOINTS.SET_STATE_HEAD, {
        organizationId,
        state
      });

      if (response.data.success) {
        showNotification(`State head set successfully for ${state}`, 'success');
        fetchOrganizations(state);
      }
    } catch (error) {
      console.error('Error setting state head:', error);
      showNotification(error.response?.data?.error || 'Failed to set state head', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveDistrictHead = async (organizationId, district, state) => {
    if (!window.confirm(`Are you sure you want to remove this organization as the head of ${district} district?`)) {
      return;
    }

    try {
      setActionLoading(`remove-district-${organizationId}`);
      const response = await axios.post(API_ENDPOINTS.REMOVE_DISTRICT_HEAD, {
        organizationId,
        district,
        state
      });

      if (response.data.success) {
        showNotification(`District head removed successfully for ${district}`, 'success');
        fetchOrganizations(state);
      }
    } catch (error) {
      console.error('Error removing district head:', error);
      showNotification(error.response?.data?.error || 'Failed to remove district head', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveStateHead = async (organizationId, state) => {
    if (!window.confirm(`Are you sure you want to remove this organization as the head of ${state} state?`)) {
      return;
    }

    try {
      setActionLoading(`remove-state-${organizationId}`);
      const response = await axios.post(API_ENDPOINTS.REMOVE_STATE_HEAD, {
        organizationId,
        state
      });

      if (response.data.success) {
        showNotification(`State head removed successfully for ${state}`, 'success');
        fetchOrganizations(state);
      }
    } catch (error) {
      console.error('Error removing state head:', error);
      showNotification(error.response?.data?.error || 'Failed to remove state head', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = 
      org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.district?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedDistrict) {
      return matchesSearch && org.district === selectedDistrict;
    }
    return matchesSearch;
  });

  const currentStateHead = organizations.find(org => org.isStateHead);
  const districtHeads = organizations.filter(org => org.isDistrictHead);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-10 h-10 text-yellow-600" />
          <div>
            <h1 className="text-4xl font-bold text-gray-800">District & State Heads Management</h1>
            <p className="text-gray-600">Assign district and state heads from approved organizations</p>
          </div>
        </div>

        {/* State Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select State</label>
          <select
            value={selectedState || ''}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict(null);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a State --</option>
            {states.map((state) => (
              <option key={state.id || state.name} value={state.name}>
                {state.name} ({state.type})
              </option>
            ))}
          </select>
        </div>

        {selectedState && (
          <>
            {/* District Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by District (Optional)</label>
              <select
                value={selectedDistrict || ''}
                onChange={(e) => setSelectedDistrict(e.target.value || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- All Districts --</option>
                {districts.map((district, idx) => (
                  <option key={idx} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Heads Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentStateHead && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-6 text-white"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className="w-8 h-8" />
                    <h3 className="text-xl font-bold">State Head</h3>
                  </div>
                  <p className="text-lg font-semibold">{currentStateHead.name}</p>
                  <p className="text-sm opacity-90">{currentStateHead.district} District</p>
                  <p className="text-sm opacity-90">{currentStateHead.phone}</p>
                </motion.div>
              )}

              {districtHeads.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-8 h-8" />
                    <h3 className="text-xl font-bold">District Heads ({districtHeads.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {districtHeads.map((head, idx) => (
                      <div key={idx} className="text-sm">
                        <p className="font-semibold">{head.name}</p>
                        <p className="opacity-90">{head.district} District</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search organizations by name, email, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Organizations List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : selectedState && filteredOrganizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredOrganizations.map((org, index) => (
              <motion.div
                key={org._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-md p-6 border-2 ${
                  org.isStateHead ? 'border-yellow-400 bg-yellow-50' :
                  org.isDistrictHead ? 'border-blue-400 bg-blue-50' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-800">{org.name}</h3>
                    </div>
                    {org.isStateHead && (
                      <span className="inline-block px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold mb-2">
                        <Crown className="w-3 h-3 inline mr-1" />
                        State Head
                      </span>
                    )}
                    {org.isDistrictHead && (
                      <span className="inline-block px-2 py-1 bg-blue-400 text-blue-900 rounded-full text-xs font-semibold mb-2 ml-2">
                        <Award className="w-3 h-3 inline mr-1" />
                        District Head
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{org.district || 'N/A'}</span>
                  </div>
                  {org.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{org.phone}</span>
                    </div>
                  )}
                  {org.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{org.email}</span>
                    </div>
                  )}
                  {org.headOfficeAddress && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span className="line-clamp-2">{org.headOfficeAddress}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  {org.isDistrictHead && org.district ? (
                    <button
                      onClick={() => handleRemoveDistrictHead(org._id, org.district, org.state)}
                      disabled={actionLoading === `remove-district-${org._id}`}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm flex items-center justify-center gap-1"
                    >
                      {actionLoading === `remove-district-${org._id}` ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Remove District Head
                        </>
                      )}
                    </button>
                  ) : org.district ? (
                    <button
                      onClick={() => handleSetDistrictHead(org._id, org.district, org.state)}
                      disabled={actionLoading === org._id}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center justify-center gap-1"
                    >
                      {actionLoading === org._id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Award className="w-4 h-4" />
                          District Head
                        </>
                      )}
                    </button>
                  ) : null}
                  {org.isStateHead ? (
                    <button
                      onClick={() => handleRemoveStateHead(org._id, org.state)}
                      disabled={actionLoading === `remove-state-${org._id}`}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm flex items-center justify-center gap-1"
                    >
                      {actionLoading === `remove-state-${org._id}` ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Remove State Head
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSetStateHead(org._id, org.state)}
                      disabled={actionLoading === `state-${org._id}`}
                      className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 text-sm flex items-center justify-center gap-1"
                    >
                      {actionLoading === `state-${org._id}` ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4" />
                          State Head
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : selectedState ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <p className="text-gray-600">No organizations found for {selectedState}</p>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <p className="text-gray-600">Please select a state to view organizations</p>
        </div>
      )}

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeadsManagement;

