import React, { useState, useEffect } from 'react';

/**
 * OptimizedImage Component
 * Handles lazy loading, loading states, and error fallbacks
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallback = '/placeholder-image.png',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    // Apply Cloudinary transformations if it's a Cloudinary URL
    let finalSrc = src;
    if (src && src.includes('cloudinary.com') && src.includes('/upload/')) {
      // Inject auto quality and auto format transformations
      // We also limit the width to 1000px on the CDN side
      finalSrc = src.replace('/upload/', '/upload/c_limit,w_1000/q_auto:eco,f_auto/');
    }
    
    setCurrentSrc(finalSrc);
    setIsLoaded(false);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
    if (fallback) setCurrentSrc(fallback);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc || fallback}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 w-full h-full object-cover ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
