import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Function to handle image URL processing - supports Cloudinary and local storage
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-image.png";
    
    // If it's already a full URL (Cloudinary, http/https, or data URI), use it directly
    if (/^(https?|data):/i.test(imagePath)) {
      return imagePath;
    }
    
    // Legacy: Handle relative paths or local filenames (for backward compatibility)
    // If it starts with /, return as is
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Otherwise, prepend / for relative paths
    return `/${imagePath}`;
  };

  // Function to handle image loading errors
  const handleImageError = (id) => {
    setImageLoadErrors(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_ALL_NEWS);
        setNewsList(response.data.news || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load news. Please try again later.");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-700">Loading news...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">
        Latest <span className="text-[#344e6f]">News</span>
      </h1>

      {selectedNews ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(selectedNews.image)}
              alt={selectedNews.title}
              className={`w-full h-full object-cover ${imageLoadErrors[selectedNews._id] ? 'hidden' : ''}`}
              onError={() => handleImageError(selectedNews._id)}
            />
            {imageLoadErrors[selectedNews._id] && (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">Image not available</span>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-4">{selectedNews.title}</h2>
          <p className="text-gray-700 font-bold mt-2">{selectedNews.content}</p>
          {selectedNews.moreContent && (
            <p className="text-gray-600 mt-4">{selectedNews.moreContent}</p>
          )}
          <button
            onClick={() => setSelectedNews(null)}
            className="mt-4 text-[#133157] hover:underline font-medium"
          >
            Back to News
          </button>
        </div>
      ) : (
        <>
          {newsList.length > 0 && (
            <div
              className="relative bg-white rounded-lg shadow-md overflow-hidden mb-12 cursor-pointer"
              onClick={() => setSelectedNews(newsList[0])}
            >
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={getImageUrl(newsList[0].image)}
                  alt="Featured News"
                  className={`w-full h-full object-cover ${imageLoadErrors[newsList[0]._id] ? 'hidden' : ''}`}
                  onError={() => handleImageError(newsList[0]._id)}
                />
                {imageLoadErrors[newsList[0]._id] && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <span className="text-white">Featured Image</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
                <h2 className="text-white text-2xl font-bold">{newsList[0].title}</h2>
                <p className="text-gray-200 mt-2">
                  {newsList[0].content.substring(0, 100)}...
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {newsList.slice(1).map((news) => (
              <div
                key={news._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedNews(news)}
              >
                <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <img
  src={getImageUrl(news.image)}
  alt={news.title}
  className={`max-w-full h-auto mx-auto ${imageLoadErrors[news._id] ? 'hidden' : ''}`}
  onError={() => handleImageError(news._id)}
/>

                  {imageLoadErrors[news._id] && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">Image not available</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">{news.title}</h3>
                <p className="text-gray-600 mt-2">
                  {news.content.substring(0, 100)}...
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNews(news);
                  }}
                  className="mt-4 text-[#34557d] hover:underline font-medium"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default News;