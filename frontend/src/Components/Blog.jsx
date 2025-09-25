import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Tag, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  TrendingUp,
  Star
} from "lucide-react";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({});

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

  // Fetch blog data
  useEffect(() => {
    fetchBlogData();
  }, [currentPage, selectedCategory, searchQuery]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
        category: selectedCategory,
        search: searchQuery,
        published: '' // Don't filter by published status to show all posts
      });

      const [postsRes, featuredRes, categoriesRes, tagsRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/admin/blog/posts?${params}`),
        axios.get(`http://localhost:3001/api/admin/blog/featured?limit=3`),
        axios.get(`http://localhost:3001/api/admin/blog/categories`),
        axios.get(`http://localhost:3001/api/admin/blog/tags`)
      ]);

      setPosts(postsRes.data.posts || []);
      setPagination(postsRes.data.pagination || {});
      setFeaturedPosts(featuredRes.data.posts || []);
      setCategories(categoriesRes.data.categories || []);
      setTags(tagsRes.data.tags || []);
      
      setLoading(false);
    } catch (err) {
      setError("Failed to load blog posts. Please try again later.");
      setLoading(false);
    }
  };

  const fetchSinglePost = async (slug) => {
    try {
      const [postRes, relatedRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/admin/blog/post/${slug}`),
        axios.get(`http://localhost:3001/api/admin/blog/related/${slug}`)
      ]);
      
      setSelectedPost(postRes.data.post);
      setRelatedPosts(relatedRes.data.posts || []);
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  };

  const handlePostClick = (post) => {
    fetchSinglePost(post.slug);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogData();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12">
        <div className="container-responsive">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12">
        <div className="container-responsive">
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12">
      <div className="container-responsive">
        
        {selectedPost ? (
          // Single Post View
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Back Button */}
            <motion.button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-6 group"
              whileHover={{ x: -5 }}
            >
              <ChevronLeft size={20} className="group-hover:animate-pulse" />
              Back to Blog
            </motion.button>

            {/* Post Header */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
              <div className="relative h-64 sm:h-80 md:h-96">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
                      {selectedPost.category}
                    </span>
                    {selectedPost.featured && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                        <Star size={14} />
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {selectedPost.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      {selectedPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(selectedPost.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {selectedPost.readTime} min read
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      {selectedPost.views} views
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6 sm:p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <div className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {selectedPost.content}
                  </div>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedPost.moreContent.replace(/\n/g, '<br>') }}
                  />
                </div>

                {/* Tags */}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={18} className="text-red-600" />
                      <span className="font-semibold text-gray-900">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                className="bg-white rounded-3xl shadow-xl p-6 sm:p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-red-600" />
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      className="group cursor-pointer"
                      onClick={() => handlePostClick(post)}
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="relative h-40">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <span className="text-xs text-red-600 font-semibold">{post.category}</span>
                          <h4 className="font-bold text-gray-900 mt-1 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // Blog List View
          <>
            {/* Hero Section */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-50 text-red-700 px-4 py-2 rounded-full font-semibold text-responsive-sm mb-6 border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                ITU BLOG
              </div>
              
              <h1 className="text-responsive-2xl font-bold text-gray-900 mb-6 leading-tight">
                Latest News &{' '}
                <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                  Insights
                </span>
              </h1>
              
              <p className="text-responsive-base text-gray-600 max-w-3xl mx-auto mb-8">
                Stay updated with the latest news, training tips, and insights from the world of Taekwondo and martial arts.
              </p>

              {/* Search and Filter Bar */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <motion.div
                className="mb-16"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <Star className="text-yellow-500" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {featuredPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      variants={itemVariants}
                      className={`group cursor-pointer ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                      onClick={() => handlePostClick(post)}
                      whileHover={{ y: -8 }}
                    >
                      <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className={`relative ${index === 0 ? 'h-64 lg:h-80' : 'h-48'}`}>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
                              {post.category}
                            </span>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className={`font-bold text-white mb-2 leading-tight ${index === 0 ? 'text-xl lg:text-2xl' : 'text-lg'}`}>
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-4 text-white/90 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(post.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {post.readTime} min
                              </div>
                            </div>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="p-6">
                            <p className="text-gray-600 leading-relaxed">
                              {post.content.substring(0, 150)}...
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Blog Posts Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="text-red-600" />
                  Latest Articles
                </h2>
                <div className="text-sm text-gray-500">
                  {pagination.totalPosts} articles found
                </div>
              </div>

              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      variants={itemVariants}
                      className="group cursor-pointer"
                      onClick={() => handlePostClick(post)}
                      whileHover={{ y: -5 }}
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                        <div className="relative h-48">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-red-600 text-white rounded-full text-xs font-semibold">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-gray-900 mb-3 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                            {post.content}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(post.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {post.readTime} min
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-red-600 font-semibold group-hover:gap-2 transition-all">
                              Read More
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <BookOpen size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
                </div>
              )}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-red-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
