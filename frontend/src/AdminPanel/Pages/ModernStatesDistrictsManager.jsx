import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Loader,
  Building2,
  Map,
  Users,
  Calendar,
  User,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const ModernStatesDistrictsManager = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDistrictsModal, setShowDistrictsModal] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [expandedStates, setExpandedStates] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    type: 'State',
    districts: [],
    active: false,
    secretary: '',
    unionName: '',
    established: ''
  });

  const [newDistrict, setNewDistrict] = useState('');

  useEffect(() => {
    fetchStates();
  }, []);

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

  const handleAddState = () => {
    setFormData({
      name: '',
      type: 'State',
      districts: [],
      active: false,
      secretary: '',
      unionName: '',
      established: ''
    });
    setNewDistrict('');
    setShowAddModal(true);
  };

  const handleEditState = (state) => {
    setSelectedState(state);
    setFormData({
      name: state.name,
      type: state.type,
      districts: state.districts || [],
      active: state.active || false,
      secretary: state.secretary || '',
      unionName: state.unionName || '',
      established: state.established || ''
    });
    setNewDistrict('');
    setShowEditModal(true);
  };

  const handleManageDistricts = (state) => {
    setSelectedState(state);
    setFormData({
      districts: state.districts || []
    });
    setNewDistrict('');
    setShowDistrictsModal(true);
  };

  const handleAddDistrict = () => {
    if (newDistrict.trim() && !formData.districts.includes(newDistrict.trim())) {
      setFormData({
        ...formData,
        districts: [...formData.districts, newDistrict.trim()]
      });
      setNewDistrict('');
    }
  };

  const handleRemoveDistrict = (district) => {
    setFormData({
      ...formData,
      districts: formData.districts.filter(d => d !== district)
    });
  };

  const handleSubmitState = async (e) => {
    e.preventDefault();
    try {
      setActionLoading('create');
      const response = await axios.post(API_ENDPOINTS.CREATE_STATE, formData);
      if (response.data.success) {
        showNotification('State/UT created successfully', 'success');
        setShowAddModal(false);
        fetchStates();
      }
    } catch (error) {
      console.error('Error creating state:', error);
      showNotification(error.response?.data?.error || 'Failed to create state', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateState = async (e) => {
    e.preventDefault();
    try {
      setActionLoading('update');
      const response = await axios.patch(
        API_ENDPOINTS.UPDATE_STATE_STATUS(selectedState.name),
        formData
      );
      if (response.data.success) {
        showNotification('State/UT updated successfully', 'success');
        setShowEditModal(false);
        fetchStates();
      }
    } catch (error) {
      console.error('Error updating state:', error);
      showNotification(error.response?.data?.error || 'Failed to update state', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateDistricts = async (e) => {
    e.preventDefault();
    try {
      setActionLoading('districts');
      const response = await axios.put(
        API_ENDPOINTS.UPDATE_DISTRICTS(selectedState.name),
        { districts: formData.districts }
      );
      if (response.data.success) {
        showNotification('Districts updated successfully', 'success');
        setShowDistrictsModal(false);
        fetchStates();
      }
    } catch (error) {
      console.error('Error updating districts:', error);
      showNotification(error.response?.data?.error || 'Failed to update districts', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteState = async (stateName) => {
    if (!window.confirm(`Are you sure you want to delete "${stateName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(stateName);
      const response = await axios.delete(API_ENDPOINTS.DELETE_STATE(stateName));
      if (response.data.success) {
        showNotification('State/UT deleted successfully', 'success');
        fetchStates();
      }
    } catch (error) {
      console.error('Error deleting state:', error);
      showNotification(error.response?.data?.error || 'Failed to delete state', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = (stateName) => {
    const newExpanded = new Set(expandedStates);
    if (newExpanded.has(stateName)) {
      newExpanded.delete(stateName);
    } else {
      newExpanded.add(stateName);
    }
    setExpandedStates(newExpanded);
  };

  const filteredStates = states.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'states' && state.type === 'State') ||
      (filterType === 'uts' && state.type === 'Union Territory') ||
      (filterType === 'active' && state.active) ||
      (filterType === 'inactive' && !state.active);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <MapPin className="w-10 h-10 text-blue-600" />
              States & Districts Management
            </h1>
            <p className="text-gray-600">Manage Indian states, union territories, and their districts</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddState}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add New State/UT
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="states">States Only</option>
              <option value="uts">Union Territories</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total States/UTs</p>
              <p className="text-3xl font-bold text-gray-800">{states.length}</p>
            </div>
            <Building2 className="w-12 h-12 text-blue-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">States</p>
              <p className="text-3xl font-bold text-gray-800">
                {states.filter(s => s.type === 'State').length}
              </p>
            </div>
            <Map className="w-12 h-12 text-green-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Union Territories</p>
              <p className="text-3xl font-bold text-gray-800">
                {states.filter(s => s.type === 'Union Territory').length}
              </p>
            </div>
            <Users className="w-12 h-12 text-purple-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Districts</p>
              <p className="text-3xl font-bold text-gray-800">
                {states.reduce((sum, s) => sum + (s.districtCount || 0), 0)}
              </p>
            </div>
            <MapPin className="w-12 h-12 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* States List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredStates.map((state, index) => (
              <motion.div
                key={state.id || state.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">{state.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          state.type === 'State' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {state.type}
                        </span>
                        {state.active && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{state.districtCount || 0} Districts</span>
                        </div>
                        {state.secretary && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="text-sm">{state.secretary}</span>
                          </div>
                        )}
                        {state.unionName && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="w-4 h-4" />
                            <span className="text-sm">{state.unionName}</span>
                          </div>
                        )}
                        {state.established && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{state.established}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleManageDistricts(state)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Manage Districts"
                      >
                        <MapPin className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditState(state)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit State"
                      >
                        <Edit3 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteState(state.name)}
                        disabled={actionLoading === state.name}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete State"
                      >
                        {actionLoading === state.name ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleExpand(state.name)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="View Districts"
                      >
                        {expandedStates.has(state.name) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Expanded Districts View */}
                  <AnimatePresence>
                    {expandedStates.has(state.name) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <h4 className="font-semibold text-gray-700 mb-3">Districts ({state.districts?.length || 0}):</h4>
                        <div className="flex flex-wrap gap-2">
                          {state.districts?.map((district, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {district}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add State Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Add New State/UT</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitState} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/UT Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="State">State</option>
                      <option value="Union Territory">Union Territory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Districts
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newDistrict}
                        onChange={(e) => setNewDistrict(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDistrict())}
                        placeholder="Enter district name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddDistrict}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.districts.map((district, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                        >
                          {district}
                          <button
                            type="button"
                            onClick={() => handleRemoveDistrict(district)}
                            className="hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">Active Union</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secretary Name
                    </label>
                    <input
                      type="text"
                      value={formData.secretary}
                      onChange={(e) => setFormData({ ...formData, secretary: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Union Name
                    </label>
                    <input
                      type="text"
                      value={formData.unionName}
                      onChange={(e) => setFormData({ ...formData, unionName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Established Year
                    </label>
                    <input
                      type="text"
                      value={formData.established}
                      onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                      placeholder="e.g., 2020"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'create'}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === 'create' ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Create State/UT
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit State Modal */}
      <AnimatePresence>
        {showEditModal && selectedState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Edit State/UT: {selectedState.name}</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateState} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="State">State</option>
                      <option value="Union Territory">Union Territory</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">Active Union</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secretary Name
                    </label>
                    <input
                      type="text"
                      value={formData.secretary}
                      onChange={(e) => setFormData({ ...formData, secretary: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Union Name
                    </label>
                    <input
                      type="text"
                      value={formData.unionName}
                      onChange={(e) => setFormData({ ...formData, unionName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Established Year
                    </label>
                    <input
                      type="text"
                      value={formData.established}
                      onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'update'}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === 'update' ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update State/UT
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Districts Modal */}
      <AnimatePresence>
        {showDistrictsModal && selectedState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDistrictsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Manage Districts: {selectedState.name}</h2>
                <button
                  onClick={() => setShowDistrictsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateDistricts} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add District
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDistrict())}
                      placeholder="Enter district name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddDistrict}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Districts ({formData.districts.length}):
                  </p>
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.districts.map((district, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                        >
                          {district}
                          <button
                            type="button"
                            onClick={() => handleRemoveDistrict(district)}
                            className="hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {formData.districts.length === 0 && (
                        <p className="text-gray-500 text-sm">No districts added yet</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDistrictsModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'districts'}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === 'districts' ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Districts
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default ModernStatesDistrictsManager;

