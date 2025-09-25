import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, GET_UPLOAD_URL } from '../../config/api';
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Eye,
  Search,
  Filter,
  Calendar,
  Tag,
  User,
  Clock,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  Star,
  CheckCircle,
  AlertCircle,
  Loader,
  MoreVertical,
  Upload,
  Grid3X3,
  List
} from "lucide-react";

const ModernNewsManager = () => {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    moreContent: "",
    author: "ITU Admin",
    category: "News",
    tags: "",
    featured: false,
    published: true,
    readTime: 5,
    metaDescription: ""
  });
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = ["News", "Training", "Events", "Competitions", "Achievements", "Self Defence", "Health & Fitness"];

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
    fetchNews();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.GET_ALL_NEWS);
      setNewsList(res.data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      showNotification("Failed to load blog posts", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        showNotification("Invalid image format. Only JPG, PNG, WEBP, or GIF are allowed.", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image must be less than 5MB", "error");
        return;
      }
      setImage(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.moreContent) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    if (!editId && !image) {
      showNotification("Please select an image", "error");
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    if (image) {
      submitData.append("image", image);
    }

    try {
      setSubmitLoading(true);
      
      if (editId) {
        await axios.put(API_ENDPOINTS.EDIT_NEWS(editId), submitData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        showNotification("Blog post updated successfully!");
      } else {
        await axios.post(API_ENDPOINTS.ADD_NEWS, submitData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        showNotification("Blog post created successfully!");
      }

      resetForm();
      fetchNews();
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting:", error);
      showNotification(error.response?.data?.message || "Failed to save blog post", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (news) => {
    setFormData({
      title: news.title || "",
      content: news.content || "",
      moreContent: news.moreContent || "",
      author: news.author || "ITU Admin",
      category: news.category || "News",
      tags: Array.isArray(news.tags) ? news.tags.join(", ") : (news.tags || ""),
      featured: news.featured || false,
      published: news.published !== false,
      readTime: news.readTime || 5,
      metaDescription: news.metaDescription || ""
    });
    setEditId(news._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;

    try {
      setDeleteLoading(id);
      await axios.delete(API_ENDPOINTS.DELETE_NEWS(id));
      showNotification("Blog post deleted successfully!");
      fetchNews();
    } catch (error) {
      console.error("Error deleting:", error);
      showNotification("Failed to delete blog post", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      moreContent: "",
      author: "ITU Admin",
      category: "News",
      tags: "",
      featured: false,
      published: true,
      readTime: 5,
      metaDescription: ""
    });
    setImage(null);
    setFileName("");
    setEditId(null);
  };

  const filteredNews = newsList.filter(news => {
    const matchesSearch = 
      news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || news.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

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
                <FileText className="text-red-500" />
                Blog Management
              </h1>
              <p className="text-gray-600">Create, edit, and manage your blog posts and articles</p>
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
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Plus size={16} />
                New Post
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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
                <p className="text-gray-500 text-sm">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{newsList.length}</p>
              </div>
              <FileText className="text-blue-500" size={32} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsList.filter(post => post.published !== false).length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Featured</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsList.filter(post => post.featured).length}
                </p>
              </div>
              <Star className="text-yellow-500" size={32} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsList.reduce((sum, post) => sum + (post.views || 0), 0)}
                </p>
              </div>
              <TrendingUp className="text-purple-500" size={32} />
            </div>
          </motion.div>
        </motion.div>

        {/* Posts Grid/List */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Blog Posts ({filteredNews.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-red-500" />
              <span className="ml-3 text-gray-600">Loading posts...</span>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterCategory !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Create your first blog post to get started"
                }
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mx-auto"
              >
                <Plus size={16} />
                Create First Post
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
                : "divide-y divide-gray-200"
            }>
              {filteredNews.map((news, index) => (
                <motion.div
                  key={news._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={
                    viewMode === 'grid'
                      ? "bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                      : "p-6 hover:bg-gray-50 transition-colors"
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative h-48">
                        <img
                          src={GET_UPLOAD_URL(news.image)}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/400/200';
                          }}
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                            {news.category}
                          </span>
                          {news.featured && (
                            <Star size={14} className="text-yellow-400 fill-current" />
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {news.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {news.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(news.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            {news.views || 0}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPost(news)}
                            className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(news)}
                            className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(news._id)}
                            disabled={deleteLoading === news._id}
                            className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm disabled:opacity-50"
                          >
                            {deleteLoading === news._id ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-4">
                      <img
                        src={GET_UPLOAD_URL(news.image)}
                        alt={news.title}
                        className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/100/80';
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{news.title}</h3>
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                {news.category}
                              </span>
                              {news.featured && (
                                <Star size={14} className="text-yellow-400 fill-current" />
                              )}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-1 mb-2">{news.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{news.author}</span>
                              <span>{formatDate(news.createdAt)}</span>
                              <span>{news.views || 0} views</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-4">
                            <button
                              onClick={() => setSelectedPost(news)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(news)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(news._id)}
                              disabled={deleteLoading === news._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deleteLoading === news._id ? (
                                <Loader size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Create/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editId ? "Edit Blog Post" : "Create New Blog Post"}
                    </h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter blog post title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Short Description/Excerpt *
                        </label>
                        <textarea
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          placeholder="Brief description for preview"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author
                          </label>
                          <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                          >
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="taekwondo, training, fitness"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Read Time (minutes)
                        </label>
                        <input
                          type="number"
                          name="readTime"
                          value={formData.readTime}
                          onChange={handleChange}
                          min="1"
                          max="60"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Featured Image *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600">
                              {fileName || "Click to upload image"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG, WEBP up to 5MB
                            </p>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">Featured Post</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="published"
                            checked={formData.published}
                            onChange={handleChange}
                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">Published</span>
                        </label>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Content *
                        </label>
                        <textarea
                          name="moreContent"
                          value={formData.moreContent}
                          onChange={handleChange}
                          rows={12}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          placeholder="Write your full blog post content here..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description (SEO)
                        </label>
                        <textarea
                          name="metaDescription"
                          value={formData.metaDescription}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          placeholder="SEO description for search engines (160 characters recommended)"
                          maxLength={160}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.metaDescription.length}/160 characters
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {submitLoading ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {editId ? "Update Post" : "Create Post"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Preview Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto"
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={GET_UPLOAD_URL(selectedPost.image)}
                    alt={selectedPost.title}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      {selectedPost.category}
                    </span>
                    {selectedPost.featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star size={14} />
                        Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedPost.title}
                  </h1>

                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {selectedPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(selectedPost.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {selectedPost.readTime || 5} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {selectedPost.views || 0} views
                    </span>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {selectedPost.content}
                    </p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedPost.moreContent}
                    </div>
                  </div>

                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-700">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(selectedPost.tags) ? selectedPost.tags : selectedPost.tags.split(',')).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernNewsManager;
