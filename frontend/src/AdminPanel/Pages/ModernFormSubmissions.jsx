import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, GET_UPLOAD_URL } from '../../config/api';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  Mail,
  User,
  MapPin,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader,
  Download,
  RefreshCw,
  Key,
  Send,
  UserCheck,
  UserX,
  MoreVertical,
  Copy,
  ExternalLink,
  Trash2
} from "lucide-react";

const ModernFormSubmissions = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvingId, setApprovingId] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    filterForms();
  }, [forms, searchTerm, statusFilter]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_FORM);
      const formsData = Array.isArray(response.data) ? response.data : (response.data.forms || []);
      setForms(formsData);
    } catch (error) {
      console.error("Error fetching forms:", error);
      showNotification("Failed to load form submissions", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterForms = () => {
    let filtered = forms.filter(form => {
      const matchesSearch = 
        form.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || form.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
    
    setFilteredForms(filtered);
  };

  const generatePassword = (state) => {
    const cleanStateName = state.replace(/\s+/g, '').toLowerCase();
    const password = `${cleanStateName}ITU@540720`;
    return password;
  };

  const handleApprove = async (formId, email, state, name) => {
    try {
      setApprovingId(formId);
      const password = generatePassword(state);
      setGeneratedPassword(password);
      
      await axios.put(API_ENDPOINTS.APPROVE_FORM, {
        formId,
        email,
        password
      });

      await fetchForms();
      setShowPasswordModal({ email, password, name, state });
      showNotification(`Form approved! Credentials sent to ${email}`);
    } catch (error) {
      console.error("Error approving form:", error);
      showNotification(error.response?.data?.error || "Failed to approve form", "error");
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async (formId, email, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name} (${email})? This action cannot be undone and will delete the user from all databases.`)) {
      return;
    }

    try {
      setDeletingId(formId);
      const response = await axios.delete(API_ENDPOINTS.DELETE_USER, {
        data: { formId, email }
      });

      if (response.data.success) {
        showNotification(`User ${name} deleted successfully from ${response.data.deletedFrom.join(', ')}`, "success");
        await fetchForms();
        if (selectedForm && selectedForm._id === formId) {
          setSelectedForm(null);
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification(error.response?.data?.error || "Failed to delete user", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) { // Less than 24 hours
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <UserCheck size={14} />;
      case 'pending':
        return <Clock size={14} />;
      case 'rejected':
        return <UserX size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const statusCounts = {
    total: forms.length,
    pending: forms.filter(f => f.status === 'pending').length,
    approved: forms.filter(f => f.status === 'approved').length,
    rejected: forms.filter(f => f.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
                notification.type === 'success' ? 'bg-green-500 text-white' :
                notification.type === 'error' ? 'bg-red-500 text-white' :
                'bg-blue-500 text-white'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FileText className="text-red-500" />
                Form Submissions
              </h1>
              <p className="text-gray-600">
                Manage state union registration applications and approvals
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchForms}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
              <FileText className="text-blue-500" size={32} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
              </div>
              <UserCheck className="text-green-500" size={32} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
              </div>
              <UserX className="text-red-500" size={32} />
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, state, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Forms List */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-red-500" />
              <span className="ml-3 text-gray-600">Loading form submissions...</span>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-20">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No form submissions found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'No form submissions yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredForms.map((form, index) => (
                <motion.div
                  key={form._id}
                  variants={itemVariants}
                  className="p-6 hover:bg-gray-50 transition-all cursor-pointer"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {form.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{form.name || 'Unknown'}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(form.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(form.status)}
                              {form.status || 'pending'}
                            </div>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Mail size={14} />
                            <span className="truncate">{form.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone size={14} />
                            <span>{form.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{form.state}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(form.createdAt || form.timestamp)}</span>
                          </div>
                        </div>

                        {form.address && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            <MapPin size={12} className="inline mr-1" />
                            {form.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {form.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(form._id, form.email, form.state, form.name);
                          }}
                          disabled={approvingId === form._id}
                          className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm"
                        >
                          {approvingId === form._id ? (
                            <Loader size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                          Approve
                        </button>
                      )}

                      {form.status === 'approved' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(form._id, form.email, form.name);
                          }}
                          disabled={deletingId === form._id}
                          className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
                          title="Delete user completely from all databases"
                        >
                          {deletingId === form._id ? (
                            <Loader size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Delete
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedForm(form);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Form Detail Modal */}
        <AnimatePresence>
          {selectedForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setSelectedForm(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {selectedForm.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedForm.name}</h2>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedForm.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(selectedForm.status)}
                              {selectedForm.status || 'pending'}
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedForm(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                          <span className="text-gray-900">{selectedForm.email}</span>
                          <button
                            onClick={() => copyToClipboard(selectedForm.email)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                          <span className="text-gray-900">{selectedForm.phone}</span>
                          <button
                            onClick={() => copyToClipboard(selectedForm.phone)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">State</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{selectedForm.state}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{selectedForm.address}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Submitted</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                          <Calendar size={16} className="text-gray-500" />
                          <span className="text-gray-900">
                            {new Date(selectedForm.createdAt || selectedForm.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {selectedForm.status === 'approved' && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Generated Password</label>
                          <div className="mt-1 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                            <code className="text-green-700 font-mono text-sm">
                              {generatePassword(selectedForm.state)}
                            </code>
                            <button
                              onClick={() => copyToClipboard(generatePassword(selectedForm.state))}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedForm.status === 'pending' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleApprove(selectedForm._id, selectedForm.email, selectedForm.state, selectedForm.name)}
                          disabled={approvingId === selectedForm._id}
                          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {approvingId === selectedForm._id ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                          Approve Application
                        </button>
                        
                        <button className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-700 rounded-xl hover:bg-red-50 transition-colors">
                          <X size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedForm.status === 'approved' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDelete(selectedForm._id, selectedForm.email, selectedForm.name)}
                          disabled={deletingId === selectedForm._id}
                          className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {deletingId === selectedForm._id ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete User Completely
                        </button>
                        <p className="text-xs text-gray-500 ml-2">
                          This will permanently delete the user from all databases
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setShowPasswordModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Key className="text-green-500" />
                      Credentials Generated
                    </h2>
                    <button
                      onClick={() => setShowPasswordModal(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-green-500" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {showPasswordModal.name} Approved!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Login credentials have been sent to {showPasswordModal.email}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <span className="text-gray-900">{showPasswordModal.email}</span>
                        <button
                          onClick={() => copyToClipboard(showPasswordModal.email)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Generated Password</label>
                      <div className="mt-1 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                        <code className="text-green-700 font-mono text-sm">
                          {showPasswordModal.password}
                        </code>
                        <button
                          onClick={() => copyToClipboard(showPasswordModal.password)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => setShowPasswordModal(null)}
                      className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => copyToClipboard(`Email: ${showPasswordModal.email}\nPassword: ${showPasswordModal.password}`)}
                      className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernFormSubmissions;
