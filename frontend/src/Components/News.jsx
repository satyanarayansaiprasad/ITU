import React, { useState } from 'react';
import { motion } from 'framer-motion';

const News = () => {
  // Sample blog data
  const blogs = [
    {
      id: 1,
      title: 'New Product Launch Coming Soon',
      excerpt: 'We are excited to announce our new product line launching next month with innovative features.',
      date: 'June 15, 2023',
      category: 'Product',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: 2,
      title: 'Company Wins Industry Award',
      excerpt: 'Our company has been recognized as the most innovative in our sector for the third consecutive year.',
      date: 'May 28, 2023',
      category: 'Awards',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: 3,
      title: 'Upcoming Community Event',
      excerpt: 'Join us for our annual community day with workshops, networking, and special guest speakers.',
      date: 'July 5, 2023',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'
    },
    {
      id: 4,
      title: 'Sustainability Initiatives Update',
      excerpt: 'Learn about our new sustainability goals and how we plan to achieve carbon neutrality by 2025.',
      date: 'June 22, 2023',
      category: 'Sustainability',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: 5,
      title: 'Partnership Announcement',
      excerpt: 'We are proud to announce our new strategic partnership with leading industry innovators.',
      date: 'July 10, 2023',
      category: 'Partnerships',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: 6,
      title: 'Technology Innovation Showcase',
      excerpt: 'See our latest technological advancements at our upcoming showcase event in September.',
      date: 'August 3, 2023',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    }
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;

  // Calculate current blogs to display
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2545] mb-2 relative inline-block">
            Upcoming News

          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest announcements and events
          </p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {currentBlogs.map((blog) => (
            <motion.div
              key={blog.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-lg overflow-hidden group"
            >
              <motion.div 
                variants={imageVariants}
                className="relative h-48 overflow-hidden"
              >
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {blog.category}
                </span>
              </motion.div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0B2545] mb-2 group-hover:text-[#4d5675] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {blog.date}
                  </span>
                  <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center">
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {blogs.length > blogsPerPage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <nav className="flex items-center space-x-2">
              {Array.from({ length: Math.ceil(blogs.length / blogsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;