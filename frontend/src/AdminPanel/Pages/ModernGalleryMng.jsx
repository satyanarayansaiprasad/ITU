import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS, GET_UPLOAD_URL } from '../../config/api';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit3,
  Eye,
  X,
  Plus,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Loader,
  Download,
  Grid3X3,
  List,
  Search,
  Filter,
  Star,
  Heart,
  Share2,
  ZoomIn,
  Calendar,
  Tag
} from 'lucide-react';

const ModernGalleryMng = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showPreview, setShowPreview] = useState(null);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');

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
    fetchGallery();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_GALLERY);
      setGalleryImages(response.data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      showNotification('Failed to fetch gallery images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file', 'error');
      return;
    }

    // Validate file size (10MB limit for gallery)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('Image size must be less than 10MB', 'error');
      return;
    }

    setNewImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setShowUploadModal(true);
  };

  const handleUpload = async () => {
    if (!newImage) {
      showNotification('Please select an image first', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('title', imageTitle);
    formData.append('description', imageDescription);

    try {
      setUploadLoading(true);
      await axios.post(API_ENDPOINTS.UPLOAD_GALLERY, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setNewImage(null);
      setPreview(null);
      setImageTitle('');
      setImageDescription('');
      setShowUploadModal(false);
      await fetchGallery();
      showNotification('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      showNotification('Upload failed. Please try again.', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      setDeleteLoading(id);
      await axios.delete(API_ENDPOINTS.DELETE_GALLERY(id));
      await fetchGallery();
      showNotification('Image deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      showNotification('Delete failed. Please try again.', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) return;

    try {
      await Promise.all(
        selectedImages.map(id => axios.delete(API_ENDPOINTS.DELETE_GALLERY(id)))
      );
      setSelectedImages([]);
      await fetchGallery();
      showNotification(`${selectedImages.length} images deleted successfully!`);
    } catch (error) {
      showNotification('Failed to delete some images', 'error');
    }
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const filteredImages = galleryImages.filter(image =>
    image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                <ImageIcon className="text-red-500" />
                Gallery Management
              </h1>
              <p className="text-gray-600">Manage your photo gallery with advanced features</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>

              {selectedImages.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete ({selectedImages.length})
                </button>
              )}
              
              <button
                onClick={fetchGallery}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
                <Plus size={16} />
                Add Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search gallery images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
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
                <p className="text-gray-500 text-sm">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{galleryImages.length}</p>
              </div>
              <ImageIcon className="text-blue-500" size={32} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Selected</p>
                <p className="text-2xl font-bold text-gray-900">{selectedImages.length}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {galleryImages.filter(img => {
                    const imgDate = new Date(img.uploadedAt || img.createdAt);
                    const now = new Date();
                    return imgDate.getMonth() === now.getMonth() && imgDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="text-purple-500" size={32} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(galleryImages.length * 2.5)}MB
                </p>
              </div>
              <Download className="text-orange-500" size={32} />
            </div>
          </motion.div>
        </motion.div>

        {/* Images Grid/List */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Gallery Images ({filteredImages.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-red-500" />
              <span className="ml-3 text-gray-600">Loading images...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Upload your first image to get started'}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
                : "divide-y divide-gray-200"
            }>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={
                    viewMode === 'grid'
                      ? `bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative ${
                          selectedImages.includes(image._id) ? 'ring-2 ring-red-500' : ''
                        }`
                      : `p-6 hover:bg-gray-50 transition-colors ${
                          selectedImages.includes(image._id) ? 'bg-red-50' : ''
                        }`
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(image._id)}
                          onChange={() => toggleImageSelection(image._id)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500 bg-white/80"
                        />
                      </div>

                      <div className="relative aspect-square">
                        <img
                          src={GET_UPLOAD_URL(image.filename)}
                          alt={image.title || `Gallery image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/300/300';
                          }}
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <button
                              onClick={() => setShowPreview(GET_UPLOAD_URL(image.filename))}
                              className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all"
                            >
                              <ZoomIn size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingImage(image);
                                setImageTitle(image.title || '');
                                setImageDescription(image.description || '');
                              }}
                              className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(image._id)}
                              disabled={deleteLoading === image._id}
                              className="p-2 bg-red-500 bg-opacity-80 rounded-full text-white hover:bg-opacity-100 transition-all disabled:opacity-50"
                            >
                              {deleteLoading === image._id ? (
                                <Loader size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 truncate mb-1">
                          {image.title || `Image ${index + 1}`}
                        </h3>
                        {image.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {image.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(image.uploadedAt || image.createdAt)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image._id)}
                        onChange={() => toggleImageSelection(image._id)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      
                      <img
                        src={GET_UPLOAD_URL(image.filename)}
                        alt={image.title || `Gallery image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/64/64';
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {image.title || `Image ${index + 1}`}
                        </h3>
                        {image.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {image.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(image.uploadedAt || image.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setShowPreview(GET_UPLOAD_URL(image.image))}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingImage(image);
                            setImageTitle(image.title || '');
                            setImageDescription(image.description || '');
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(image._id)}
                          disabled={deleteLoading === image._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === image._id ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Upload Image</h2>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {preview && (
                    <div className="mb-6">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter image title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        placeholder="Enter image description"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <button
                      onClick={handleUpload}
                      disabled={uploadLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {uploadLoading ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {uploadLoading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
              onClick={() => setShowPreview(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={showPreview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setShowPreview(null)}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                >
                  <X size={20} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernGalleryMng;
