import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS, GET_UPLOAD_URL } from '../config/api';
import { X, ZoomIn, Download, Heart } from 'lucide-react';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_GALLERY);
      setGalleryImages(response.data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (filename) => {
    if (!filename) return "/default-image.png";
    if (/^(https?|data):/i.test(filename)) return filename;
    if (filename.startsWith('/')) return filename;
    return GET_UPLOAD_URL(filename);
  };

  const handleImageError = (id) => {
    setImageLoadErrors((prev) => ({ ...prev, [id]: true }));
  };

  const toggleLike = (imageId) => {
    setLikedImages(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(imageId)) {
        newLiked.delete(imageId);
      } else {
        newLiked.add(imageId);
      }
      return newLiked;
    });
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'taekwondo-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (loading) {
    return (
      <div className="container-responsive spacing-responsive-lg">
        <div className="text-center mb-12">
          <h1 className="text-responsive-2xl font-bold text-gray-900 mb-4">Gallery</h1>
          <p className="text-responsive-base text-gray-600">Loading our amazing moments...</p>
        </div>
        <div className="grid-responsive-1-2-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="aspect-square-responsive skeleton rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[110px] sm:pt-[115px] md:pt-[120px]">
      <div className="container-responsive spacing-responsive-lg">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold text-responsive-sm mb-6 border border-orange-200">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            PHOTO GALLERY
          </div>
          
          <h1 className="text-responsive-2xl font-bold text-gray-900 mb-4 leading-tight">
            Indian Taekwondo Union{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Photo Gallery
            </span>
          </h1>
          
          <p className="text-responsive-base text-gray-600 max-w-2xl mx-auto">
            Discover our martial arts journey through exclusive photos of Taekwondo training sessions, 
            tournaments, competitions, and achievements. See 50,000+ students and 500+ instructors 
            in action across India's premier Taekwondo Federation.
          </p>
        </motion.div>

        {/* Gallery Grid */}
      {galleryImages.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🥋</div>
            <h3 className="text-responsive-lg font-semibold text-gray-700 mb-2">
              No Images Available
            </h3>
            <p className="text-responsive-base text-gray-500">
              Check back soon for amazing photos from our events and training sessions.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {galleryImages.map((img, index) => {
            const imageUrl = getImageUrl(img.filename);
              const hasError = imageLoadErrors[img._id];
              const isLiked = likedImages.has(img._id);

            return (
                <motion.div
                key={img._id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setSelectedImage({ ...img, imageUrl })}
                >
                  <div className="aspect-square-responsive overflow-hidden">
                    <img
                      src={hasError ? "/default-image.png" : imageUrl}
                      alt={img.title || `Indian Taekwondo Union Training Session - Professional Martial Arts Training in India`}
                      onError={() => handleImageError(img._id)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-2 truncate">
                          {img.title || 'Taekwondo Training'}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-xs">
                            Click to view
                          </span>
                          <ZoomIn className="text-white/80 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(img._id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                        isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(imageUrl, img.filename);
                      }}
                      className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all duration-300"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-area-padding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 p-2"
              >
                <X size={32} />
              </button>

              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title || "Gallery Image"}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white font-bold text-xl mb-2">
                    {selectedImage.title || 'Taekwondo Training'}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">
                      Indian Taekwondo Union Gallery
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleLike(selectedImage._id)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          likedImages.has(selectedImage._id)
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Heart size={20} fill={likedImages.has(selectedImage._id) ? 'currentColor' : 'none'} />
                      </button>
                      
                      <button
                        onClick={() => downloadImage(selectedImage.imageUrl, selectedImage.filename)}
                        className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
