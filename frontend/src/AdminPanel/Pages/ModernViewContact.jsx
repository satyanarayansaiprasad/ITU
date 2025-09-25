import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Mail,
  Search,
  Filter,
  Eye,
  Reply,
  Trash2,
  Download,
  Calendar,
  User,
  MessageSquare,
  Clock,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Archive,
  Star,
  MoreVertical
} from 'lucide-react';

const ModernViewContact = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [notification, setNotification] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

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
    fetchContacts();
  }, []);

  useEffect(() => {
    filterAndSortContacts();
  }, [contacts, searchTerm, filterStatus, sortBy]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/admin/getContact');
      const contactsData = Array.isArray(response.data) ? response.data : (response.data.contacts || []);
      setContacts(contactsData.map(contact => ({ ...contact, status: 'unread', starred: false })));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showNotification('Failed to fetch contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortContacts = useCallback(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch = 
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subjects?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;

      return matchesSearch && matchesFilter;
    });

    // Sort contacts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp);
        case 'oldest':
          return new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'subject':
          return (a.subjects || '').localeCompare(b.subjects || '');
        default:
          return 0;
      }
    });

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, filterStatus, sortBy]);

  const handleReply = (contact) => {
    window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subjects}&body=Dear ${contact.name},%0A%0AThank you for contacting ITU. %0A%0A`;
  };

  const markAsRead = (contactId) => {
    setContacts(prev => prev.map(contact =>
      contact._id === contactId ? { ...contact, status: 'read' } : contact
    ));
  };

  const toggleStar = (contactId) => {
    setContacts(prev => prev.map(contact =>
      contact._id === contactId ? { ...contact, starred: !contact.starred } : contact
    ));
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      setDeleteLoading(contactId);
      // Add delete API call here if available
      setContacts(prev => prev.filter(contact => contact._id !== contactId));
      showNotification('Contact deleted successfully');
    } catch (error) {
      showNotification('Failed to delete contact', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) { // Less than 24 hours
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) { // Less than 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getPriorityColor = (subject) => {
    const urgent = ['urgent', 'emergency', 'important', 'asap'];
    const normal = ['inquiry', 'question', 'info'];
    
    const subjectLower = subject?.toLowerCase() || '';
    
    if (urgent.some(word => subjectLower.includes(word))) return 'bg-red-100 text-red-700';
    if (normal.some(word => subjectLower.includes(word))) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
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
                <Mail className="text-red-500" />
                Contact Submissions
              </h1>
              <p className="text-gray-600">
                Manage and respond to user inquiries and contact form submissions
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <span className="text-sm text-gray-500">Total: </span>
                <span className="font-bold text-gray-900">{contacts.length}</span>
              </div>
              
              <button
                onClick={fetchContacts}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Loader size={16} className={loading ? 'animate-spin' : 'hidden'} />
                Refresh
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
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
                placeholder="Search by name, email, subject, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
                <option value="subject">By Subject</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Contacts List */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-red-500" />
              <span className="ml-3 text-gray-600">Loading contacts...</span>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-20">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'No contact submissions yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact._id}
                  variants={itemVariants}
                  className={`p-6 hover:bg-gray-50 transition-all cursor-pointer ${
                    contact.status === 'unread' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedContact(contact);
                    markAsRead(contact._id);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {contact.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`font-semibold ${contact.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                            {contact.name || 'Unknown'}
                          </h3>
                          <span className="text-sm text-gray-500">{contact.email}</span>
                          {contact.starred && (
                            <Star size={16} className="text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.subjects)}`}>
                            {contact.subjects || 'No Subject'}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(contact.createdAt || contact.timestamp)}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2">
                          {contact.message || 'No message content'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(contact._id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          contact.starred ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                        }`}
                      >
                        <Star size={16} className={contact.starred ? 'fill-current' : ''} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReply(contact);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Reply size={16} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(contact._id);
                        }}
                        disabled={deleteLoading === contact._id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === contact._id ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Contact Detail Modal */}
        <AnimatePresence>
          {selectedContact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setSelectedContact(null)}
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
                        {selectedContact.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedContact.name}</h2>
                        <p className="text-gray-500">{selectedContact.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subject</label>
                      <div className={`mt-1 px-3 py-2 rounded-lg ${getPriorityColor(selectedContact.subjects)}`}>
                        {selectedContact.subjects || 'No Subject'}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Message</label>
                      <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {selectedContact.message || 'No message content'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Received</label>
                      <p className="mt-1 text-gray-600 flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(selectedContact.createdAt || selectedContact.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => handleReply(selectedContact)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Reply size={16} />
                      Reply via Email
                    </button>
                    <button
                      onClick={() => toggleStar(selectedContact._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedContact.starred
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Star size={16} className={selectedContact.starred ? 'fill-current' : ''} />
                      {selectedContact.starred ? 'Unstar' : 'Star'}
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

export default ModernViewContact;
