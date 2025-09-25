import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Chart color schemes
const COLORS = {
  primary: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'],
  gradient: ['#ef4444', '#f97316'],
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  info: '#3b82f6'
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Animated counter hook
const useCounter = (end, duration = 1000, start = 0) => {
  const [count, setCount] = React.useState(start);
  
  React.useEffect(() => {
    if (start === end) return;
    
    const increment = (end - start) / (duration / 16);
    const timer = setInterval(() => {
      setCount(prevCount => {
        const nextCount = prevCount + increment;
        if ((increment > 0 && nextCount >= end) || (increment < 0 && nextCount <= end)) {
          clearInterval(timer);
          return end;
        }
        return nextCount;
      });
    }, 16);
    
    return () => clearInterval(timer);
  }, [end, duration, start]);
  
  return Math.floor(count);
};

// Overview Stats Cards
export const StatsCard = ({ title, value, change, icon, color = "blue", previousValue, isAnimating }) => {
  const animatedValue = useCounter(value, 1000, previousValue || 0);
  const displayValue = isAnimating ? animatedValue : value;
  
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 text-blue-600",
    red: "from-red-500 to-red-600 text-red-600",
    green: "from-green-500 to-green-600 text-green-600",
    purple: "from-purple-500 to-purple-600 text-purple-600",
    orange: "from-orange-500 to-orange-600 text-orange-600",
    pink: "from-pink-500 to-pink-600 text-pink-600"
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated background pulse when updating */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1, repeat: 1 }}
        />
      )}
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <motion.div 
          className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}
          animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="text-white">
            {icon}
          </div>
        </motion.div>
        {change !== undefined && (
          <motion.div 
            className={`text-sm font-semibold px-2 py-1 rounded-full ${
              change > 0 ? 'bg-green-100 text-green-700' : 
              change < 0 ? 'bg-red-100 text-red-700' : 
              'bg-gray-100 text-gray-700'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {change > 0 ? '+' : ''}{change}%
          </motion.div>
        )}
      </div>
      <div className="relative z-10">
        <motion.h3 
          className="text-2xl font-bold text-gray-900 mb-1"
          animate={isAnimating ? { color: ['#111827', '#ef4444', '#111827'] } : {}}
          transition={{ duration: 1 }}
        >
          {displayValue.toLocaleString()}
        </motion.h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
      
      {/* Live indicator */}
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </motion.div>
  );
};

// Monthly Stats Line Chart
export const MonthlyStatsChart = ({ data }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="posts"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorPosts)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorViews)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Category Distribution Pie Chart
export const CategoryChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: item._id,
    value: item.count
  }));

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Content by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Top Posts Bar Chart
export const TopPostsChart = ({ data }) => {
  const chartData = data.slice(0, 8).map(post => ({
    title: post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title,
    views: post.views,
    category: post.category
  }));

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Posts</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" stroke="#64748b" fontSize={12} />
          <YAxis 
            type="category" 
            dataKey="title" 
            stroke="#64748b" 
            fontSize={12}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="views" 
            fill="#ef4444"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Engagement by Category Chart
export const EngagementChart = ({ data }) => {
  const chartData = data.map(item => ({
    category: item._id,
    totalViews: item.totalViews,
    avgViews: Math.round(item.avgViews),
    postCount: item.postCount
  }));

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Engagement by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="category" 
            stroke="#64748b" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="totalViews" 
            fill="#ef4444" 
            name="Total Views"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="avgViews" 
            fill="#3b82f6" 
            name="Avg Views"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Daily Views Line Chart
export const DailyViewsChart = ({ data }) => {
  const chartData = data.slice(-14).map(item => ({
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: item.views,
    posts: item.posts
  }));

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Activity (Last 14 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            fontSize={12}
          />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="posts"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Tag Popularity Chart
export const TagPopularityChart = ({ data }) => {
  const chartData = data.slice(0, 10).map(tag => ({
    name: tag._id,
    count: tag.count,
    views: tag.totalViews
  }));

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Tags</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Live Activity Feed with real-time updates
export const LiveActivityFeed = ({ data, isLive = true }) => {
  const [activities, setActivities] = React.useState(data || []);
  const [newActivityCount, setNewActivityCount] = React.useState(0);

  React.useEffect(() => {
    setActivities(data || []);
  }, [data]);

  // Simulate real-time activity (in a real app, this would be WebSocket or polling)
  React.useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate new activity every 30 seconds
      if (Math.random() > 0.7) {
        const newActivity = {
          id: Date.now(),
          title: `New activity detected`,
          type: 'system',
          timestamp: new Date(),
          isNew: true
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
        setNewActivityCount(prev => prev + 1);
        
        // Remove new indicator after 5 seconds
        setTimeout(() => {
          setActivities(prev => prev.map(activity => 
            activity.id === newActivity.id ? { ...activity, isNew: false } : activity
          ));
        }, 5000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLive]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Recent Activity
          {isLive && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">LIVE</span>
            </div>
          )}
        </h3>
        {newActivityCount > 0 && (
          <button
            onClick={() => setNewActivityCount(0)}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-bounce"
          >
            {newActivityCount} new
          </button>
        )}
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.length > 0 ? activities.map((post, index) => (
          <motion.div
            key={post.id || index}
            initial={post.isNew ? { opacity: 0, x: -20, scale: 0.95 } : {}}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
              post.isNew 
                ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {post.isNew && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
                <h4 className={`font-semibold ${post.isNew ? 'text-blue-900' : 'text-gray-900'} text-sm`}>
                  {post.title}
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  post.category === 'Training' ? 'bg-blue-100 text-blue-700' :
                  post.category === 'Events' ? 'bg-green-100 text-green-700' :
                  post.category === 'News' ? 'bg-red-100 text-red-700' :
                  post.category === 'Self Defence' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {post.category || post.type || 'System'}
                </span>
                <span>{formatDate(post.createdAt || post.timestamp)}</span>
                {post.views && <span>{post.views} views</span>}
              </div>
            </div>
            {post.isNew && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-2"
              >
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              </motion.div>
            )}
          </motion.div>
        )) : (
          <div className="text-center py-8 text-gray-500">
            <Activity size={32} className="mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </div>
      
      {/* Live data indicator */}
      <div className="absolute top-2 right-2">
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={isLive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

