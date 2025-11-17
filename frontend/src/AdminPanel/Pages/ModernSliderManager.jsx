import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
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
  Filter
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');

const ModernSliderManager = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showPreview, setShowPreview] = useState(null);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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
    fetchSliders();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_SLIDER);
      setSliderImages(response.data || []);
    } catch (error) {
      console.error('Error fetching sliders:', error);
      showNotification('Failed to fetch slider images', 'error');
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = [];
    const newPreviews = [];

    files.forEach((file, index) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification(`File ${file.name} is not a valid image file`, 'error');
      return;
    }

      // Validate file size (10MB limit for Cloudinary)
      if (file.size > 10 * 1024 * 1024) {
        showNotification(`Image ${file.name} size must be less than 10MB`, 'error');
      return;
    }

      validFiles.push(file);
      
      // Create preview
    const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target.result);
        if (newPreviews.length === validFiles.length) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
    reader.readAsDataURL(file);
    });

    if (validFiles.length > 0) {
      setNewImages([...newImages, ...validFiles]);
      showNotification(`${validFiles.length} image(s) selected for upload`, 'success');
    }
  };

  const handleUpload = async () => {
    if (newImages.length === 0) {
      showNotification('Please select at least one image first', 'error');
      return;
    }

    const imageCount = newImages.length;

    try {
      setUploadLoading(true);
      
      // Upload all images
      const uploadPromises = newImages.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return axios.post(API_ENDPOINTS.UPLOAD_SLIDER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
        });
      });

      await Promise.all(uploadPromises);
      
      setNewImages([]);
      setPreviews([]);
      await fetchSliders();
      showNotification(`${imageCount} image(s) uploaded successfully!`);
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
      await axios.delete(API_ENDPOINTS.DELETE_SLIDER(id));
      await fetchSliders();
      showNotification('Image deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      showNotification('Delete failed. Please try again.', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const clearPreviews = () => {
    setNewImages([]);
    setPreviews([]);
  };

  const removePreview = (index) => {
    const newFiles = newImages.filter((_, i) => i !== index);
    const newPreviewsList = previews.filter((_, i) => i !== index);
    setNewImages(newFiles);
    setPreviews(newPreviewsList);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get image URL (handles both Cloudinary URLs and legacy filenames)
  const getImageUrl = (filename) => {
    if (!filename) return '/api/placeholder/400/300';
    
    // If it's already a full URL (Cloudinary or other CDN), return as is
    if (/^(https?|data):/i.test(filename)) {
      return filename;
    }
    
    // If filename already includes uploads/, use it directly (legacy local storage)
    if (filename.startsWith('uploads/')) {
      return `${API_BASE_URL}/${filename}`;
    }
    
    // Construct the URL for legacy local storage files
    const cleanFilename = filename.replace(/^\/+/, '');
    return `${API_BASE_URL}/uploads/${cleanFilename}`;
  };

  const filteredImages = sliderImages.filter(image =>
    (image.filename || image.title || '')?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Slider Management</h1>
              <p className="text-gray-600">Manage homepage slider images with drag & drop support</p>
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
              
              <button
                onClick={fetchSliders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search slider images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Upload className="text-red-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Upload New Slider Image</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <ImageIcon size={32} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      {dragActive ? 'Drop image here' : 'Upload slider image'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Drag & drop or click to select multiple images (Max: 10MB each, JPG/PNG/WEBP)
                    </p>
                  </div>
                </div>
              </div>

              {newImages.length > 0 && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={uploadLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {uploadLoading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {uploadLoading ? `Uploading ${newImages.length} image(s)...` : `Upload ${newImages.length} Image(s)`}
                  </button>
                  
                  <button
                    onClick={clearPreviews}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X size={16} />
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Preview ({previews.length} image{previews.length > 1 ? 's' : ''})
                </h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative bg-gray-100 rounded-xl overflow-hidden group">
                  <img
                    src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                  />
                      <button
                        onClick={() => removePreview(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <button
                      onClick={() => setShowPreview(preview)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all"
                    >
                          <Eye size={16} />
                    </button>
                  </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Images Grid/List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Current Slider Images ({filteredImages.length})
            </h2>
            {selectedImages.length > 0 && (
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <Trash2 size={16} />
                Delete Selected ({selectedImages.length})
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-red-500" />
              <span className="ml-3 text-gray-600">Loading images...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ImageIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No slider images found</h3>
              <p className="text-gray-500">Upload your first slider image to get started</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  variants={itemVariants}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                    viewMode === 'list' ? 'flex items-center p-4' : ''
                  }`}
                  whileHover={{ y: -5 }}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-24 h-16 flex-shrink-0' : 'aspect-video'}`}>
                    <img
                      src={getImageUrl(image.filename)}
                      alt={`Slider ${index + 1}`}
                      className="w-full h-full object-cover bg-gray-100"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.error('Image failed to load:', image.filename);
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <button
                          onClick={() => setShowPreview(getImageUrl(image.filename))}
                          className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all"
                        >
                          <Eye size={16} />
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

                  {viewMode === 'list' && (
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-900">{image.filename || `Slider Image ${index + 1}`}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded: {formatDate(image.uploadedAt || image.createdAt)}
                      </p>
                    </div>
                  )}

                  {viewMode === 'grid' && (
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {image.filename || `Slider ${index + 1}`}
                        </h3>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setShowPreview(getImageUrl(image.filename))}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(image._id)}
                            disabled={deleteLoading === image._id}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {deleteLoading === image._id ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(image.uploadedAt || image.createdAt)}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

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

export default ModernSliderManager;
