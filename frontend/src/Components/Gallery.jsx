import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const galleryImages = [
    { 
      id: 1, 
      src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 
      alt: 'Taj Mahal at sunrise', 
      cols: 2,
      title: 'Taj Mahal Sunrise',
      description: 'The iconic Taj Mahal during golden hour in Agra'
    },
    { 
      id: 2, 
      src: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 
      alt: 'Jaipur Hawa Mahal', 
      cols: 1,
      title: 'Hawa Mahal',
      description: 'The Palace of Winds in Jaipur, Rajasthan'
    },
    { 
      id: 3, 
      src: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 
      alt: 'Kerala backwaters', 
      cols: 1,
      title: 'Kerala Backwaters',
      description: 'Serene houseboat experience in Alleppey'
    },
    { 
      id: 4, 
      src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 
      alt: 'Varanasi Ghats', 
      cols: 2,
      title: 'Varanasi Ghats',
      description: 'Spiritual morning at the banks of Ganges'
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigate = (direction) => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    }
    setSelectedImage(galleryImages[newIndex]);
    setCurrentIndex(newIndex);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate('prev');
    if (e.key === 'ArrowRight') navigate('next');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Gallery</h1>
      
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.id}
            className={`break-inside-avoid relative group cursor-pointer ${image.cols === 2 ? 'sm:col-span-2' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => openLightbox(image, index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-300 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0  bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white text-3xl z-50 hover:text-gray-300 transition-colors focus:outline-none"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              &times;
            </button>

            {/* Main Content */}
            <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
              {/* Navigation Arrows */}
              <button
                onClick={() => navigate('prev')}
                className="absolute left-4 md:left-8 z-50  bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all focus:outline-none"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Image */}
              <motion.div
                className="flex items-center justify-center h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-h-[80vh] max-w-full object-contain rounded-lg"
                />
              </motion.div>

              <button
                onClick={() => navigate('next')}
                className="absolute right-4 md:right-8 z-50 bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all focus:outline-none"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image Info */}
              <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                <h2 className="text-xl font-bold">{selectedImage.title}</h2>
                <p className="text-sm opacity-80 mt-1">
                  {currentIndex + 1} / {galleryImages.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;