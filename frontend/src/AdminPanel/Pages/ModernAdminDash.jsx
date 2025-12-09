import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, GET_UPLOAD_URL } from '../../config/api';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Image as ImageIcon,
  Mail,
  Eye,
  Calendar,
  Award,
  Activity,
  Zap,
  Target,
  RefreshCw,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Share2,
  Clock,
  Wifi,
  WifiOff,
  Play,
  Pause,
  RotateCcw,
  ChevronDown
} from "lucide-react";

import {
  StatsCard,
  MonthlyStatsChart,
  CategoryChart,
  TopPostsChart,
  EngagementChart,
  DailyViewsChart,
  TagPopularityChart,
  LiveActivityFeed
} from "../../Components/DashboardCharts";

const ModernAdminDash = () => {
  const [analytics, setAnalytics] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dynamic features state
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState([]);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});
  const [previousStats, setPreviousStats] = useState({});
  
  // Refs
  const intervalRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

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

  // Dynamic functions
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const animateStatChange = useCallback((key, newValue, oldValue) => {
    if (oldValue !== undefined && newValue !== oldValue) {
      setAnimatedStats(prev => ({ ...prev, [key]: { from: oldValue, to: newValue, isAnimating: true } }));
      
      setTimeout(() => {
        setAnimatedStats(prev => ({ ...prev, [key]: { ...prev[key], isAnimating: false } }));
      }, 1000);
      
      const change = newValue - oldValue;
      if (change !== 0) {
        addNotification(
          `${key} ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)}`,
          change > 0 ? 'success' : 'warning'
        );
      }
    }
  }, [addNotification]);

  const fetchAnalytics = useCallback(async (showNotification = false) => {
    if (!isOnline) {
      setError('No internet connection');
      return;
    }

    try {
      if (showNotification) {
        addNotification('Refreshing dashboard data...', 'info');
      }
      
      setLoading(!analytics); // Only show loading on first load
      setError(null);
      
      const params = new URLSearchParams({
        dateRange,
        category: selectedCategory !== 'all' ? selectedCategory : '',
        published: '' // Don't filter by published to show all data
      });
      
      const [analyticsRes, engagementRes, contentRes] = await Promise.all([
        axios.get(`${API_ENDPOINTS.DASHBOARD_ANALYTICS}?${params}`),
        axios.get(`${API_ENDPOINTS.ENGAGEMENT_ANALYTICS}?${params}`),
        axios.get(`${API_ENDPOINTS.CONTENT_ANALYTICS}?${params}`)
      ]);

      const newAnalytics = analyticsRes.data.data;
      const newEngagement = engagementRes.data.data;
      const newContent = contentRes.data.data;

      // Animate stat changes
      if (analytics?.overview) {
        Object.keys(newAnalytics.overview).forEach(key => {
          animateStatChange(key, newAnalytics.overview[key], analytics.overview[key]);
        });
      }

      setPreviousStats(analytics?.overview || {});
      setAnalytics(newAnalytics);
      setEngagement(newEngagement);
      setContent(newContent);
      setLastUpdated(new Date());
      setLoading(false);
      
      if (showNotification) {
        addNotification('Dashboard updated successfully', 'success');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
      setLoading(false);
      addNotification('Failed to update dashboard', 'error');
    }
  }, [isOnline, dateRange, selectedCategory, analytics, animateStatChange, addNotification]);

  // Auto-refresh setup
  useEffect(() => {
    if (isAutoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchAnalytics(true);
      }, refreshInterval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRefresh, refreshInterval, fetchAnalytics]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification('Connection restored', 'success');
      fetchAnalytics(true);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      addNotification('Connection lost', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification, fetchAnalytics]);

  // Initial load and filter changes
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedCategory]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    };
  }, []);

  // Quick actions data
  const quickActions = [
    {
      title: "Create Blog Post",
      icon: <FileText size={24} />,
      link: "/admin/blogs",
      color: "blue",
      description: "Write a new article"
    },
    {
      title: "Manage Gallery",
      icon: <ImageIcon size={24} />,
      link: "/admin/gallery",
      color: "green",
      description: "Upload new images"
    },
    {
      title: "View Messages",
      icon: <Mail size={24} />,
      link: "/admin/view-contacts",
      color: "red",
      description: "Check contact forms"
    },
    {
      title: "Update Slider",
      icon: <Activity size={24} />,
      link: "/admin/slider-management",
      color: "purple",
      description: "Manage homepage slider"
    },
    {
      title: "Form Submissions",
      icon: <Users size={24} />,
      link: "/admin/form-submissions",
      color: "orange",
      description: "Review applications"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-red-600" size={24} />
          <span className="text-lg font-semibold text-gray-700">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Zap size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Notifications */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <div className="fixed top-4 right-4 z-50 space-y-2">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  className={`p-4 rounded-lg shadow-lg max-w-sm ${
                    notification.type === 'success' ? 'bg-green-500 text-white' :
                    notification.type === 'error' ? 'bg-red-500 text-white' :
                    notification.type === 'warning' ? 'bg-yellow-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <span className="font-medium">{notification.message}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                  {isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <span>Welcome back! Here's what's happening with your ITU platform.</span>
                {lastUpdated && (
                  <span className="flex items-center gap-1 text-sm">
                    <Clock size={12} />
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Auto-refresh toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className={`p-2 rounded-lg transition-colors ${
                    isAutoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                  title={isAutoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
                >
                  {isAutoRefresh ? <Play size={16} /> : <Pause size={16} />}
                </button>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-200 rounded-lg bg-white"
                  disabled={!isAutoRefresh}
                >
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              </div>

              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => fetchAnalytics(true)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Dynamic Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 3 months</option>
                      <option value="1y">Last year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="News">News</option>
                      <option value="Training">Training</option>
                      <option value="Events">Events</option>
                      <option value="Self Defence">Self Defence</option>
                      <option value="Competitions">Competitions</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setDateRange('30d');
                        setSelectedCategory('all');
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <RotateCcw size={16} />
                      Reset Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: <BarChart3 size={16} /> },
                { id: 'engagement', name: 'Engagement', icon: <TrendingUp size={16} /> },
                { id: 'content', name: 'Content', icon: <FileText size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Blog Posts"
                value={analytics?.overview?.totalPosts || 0}
                previousValue={previousStats?.totalPosts}
                change={previousStats?.totalPosts && previousStats.totalPosts > 0 && analytics?.overview?.totalPosts ? 
                  Math.round(((analytics.overview.totalPosts - previousStats.totalPosts) / previousStats.totalPosts) * 100) : undefined}
                icon={<FileText size={24} />}
                color="blue"
                isAnimating={animatedStats?.totalPosts?.isAnimating}
              />
              <StatsCard
                title="Contact Messages"
                value={analytics?.overview?.totalContacts || 0}
                previousValue={previousStats?.totalContacts}
                change={previousStats?.totalContacts && previousStats.totalContacts > 0 && analytics?.overview?.totalContacts ? 
                  Math.round(((analytics.overview.totalContacts - previousStats.totalContacts) / previousStats.totalContacts) * 100) : undefined}
                icon={<Mail size={24} />}
                color="green"
                isAnimating={animatedStats?.totalContacts?.isAnimating}
              />
              <StatsCard
                title="Form Submissions"
                value={analytics?.overview?.totalForms || 0}
                previousValue={previousStats?.totalForms}
                change={previousStats?.totalForms && previousStats.totalForms > 0 && analytics?.overview?.totalForms ? 
                  Math.round(((analytics.overview.totalForms - previousStats.totalForms) / previousStats.totalForms) * 100) : undefined}
                icon={<Users size={24} />}
                color="purple"
                isAnimating={animatedStats?.totalForms?.isAnimating}
              />
              <StatsCard
                title="Gallery Images"
                value={analytics?.overview?.totalGalleryImages || 0}
                previousValue={previousStats?.totalGalleryImages}
                change={previousStats?.totalGalleryImages && previousStats.totalGalleryImages > 0 && analytics?.overview?.totalGalleryImages ? 
                  Math.round(((analytics.overview.totalGalleryImages - previousStats.totalGalleryImages) / previousStats.totalGalleryImages) * 100) : undefined}
                icon={<ImageIcon size={24} />}
                color="orange"
                isAnimating={animatedStats?.totalGalleryImages?.isAnimating}
              />
            </div>

            {/* Monthly Performance & Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <MonthlyStatsChart data={analytics?.monthlyStats || []} />
              <CategoryChart data={analytics?.categoryStats || []} />
            </div>

            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg mb-8"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="text-yellow-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <motion.div
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group cursor-pointer hover:border-red-300"
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`mb-3 p-2 rounded-lg inline-block bg-${action.color}-100 text-${action.color}-600 group-hover:bg-${action.color}-200`}>
                        {action.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Live Activity Feed */}
            <LiveActivityFeed data={analytics?.recentPosts || []} isLive={isAutoRefresh} />
          </motion.div>
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && engagement && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopPostsChart data={engagement.topPosts} />
              <EngagementChart data={engagement.engagementByCategory} />
            </div>
            <DailyViewsChart data={engagement.dailyViews} />
          </motion.div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && content && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Published vs Draft */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Content Status</h3>
                <div className="space-y-4">
                  {content.publishedVsDraft.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${item._id ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="font-medium text-gray-900">
                          {item._id ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Featured vs Regular */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Featured Content</h3>
                <div className="space-y-4">
                  {content.featuredVsRegular.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${item._id ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                          <span className="font-medium text-gray-900">
                            {item._id ? 'Featured' : 'Regular'}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">{item.count}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Avg Views: {Math.round(item.avgViews || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <TagPopularityChart data={content.tagPopularity} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ModernAdminDash;
