import { useState, useEffect } from "react";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import {
  GiHighKick,
  GiPunchBlast,
  GiPodium,
  GiShield,
  GiBoxingGlove,
  GiSwordSlice,
 
} from "react-icons/gi";

const categories = [
  { name: "High Level Kicks", icon: <GiHighKick size={40} /> },
  { name: "Kyorugi", icon: <GiPunchBlast size={40} /> },
  { name: "Poomsae", icon: <GiPodium size={40} /> },
  { name: "Self-Defence", icon: <GiShield size={40} /> },
  { name: "Sparring", icon: <GiBoxingGlove size={40} /> },
  { name: "Weapons Training", icon: <GiSwordSlice size={40} /> },
 
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 4 },
  desktop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategorySliders();
  }, []);

  const fetchCategorySliders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_CATEGORY_SLIDER);
      if (response.data && Array.isArray(response.data)) {
        setSlides(response.data);
      }
    } catch (error) {
      console.error('Error fetching category sliders:', error);
      // Fallback to empty array if API fails
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '/api/placeholder/400/300';
    if (/^(https?|data):/i.test(image)) return image;
    if (image.startsWith('uploads/')) return `${API_BASE_URL}/${image}`;
    const cleanImage = image.replace(/^\/+/, '');
    return `${API_BASE_URL}/uploads/${cleanImage}`;
  };

  return (
    <div className="flex flex-col h-auto lg:flex-row lg:min-h-auto justify-between p-6 gap-8">
      {/* Left Category Section */}
      <div className="w-full lg:w-1/3 p-6 lg:py-30 rounded-lg">
  <h2 className="text-2xl font-bold text-center text-black mb-6">
    Taekwondo Categories
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 ">
    {categories.map((item, index) => (
      <div
        key={index}
        className={`flex flex-col items-center bg-white p-3 rounded-lg shadow-md cursor-pointer transition duration-300 ${
          selectedCategory === item.name ? "bg-blue-200" : ""
        }`}
        onClick={() => setSelectedCategory(item.name)}
      >
        <span className="text-blue-500">{item.icon}</span>
        <p className="mt-2 text-sm sm:text-base font-semibold">
          {item.name}
        </p>
      </div>
    ))}
  </div>
</div>


      {/* Right Carousel Section */}
      <div className="w-full lg:w-3/5 lg:py-30">
        {loading ? (
          <div className="flex items-center justify-center h-[300px] sm:h-[400px]">
            <div className="text-gray-500">Loading slider...</div>
          </div>
        ) : slides.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] sm:h-[400px] bg-gray-100 rounded-lg">
            <div className="text-gray-500 text-center">
              <p className="text-lg mb-2">No slider items available</p>
              <p className="text-sm">Admin can add items from the admin panel</p>
            </div>
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            infinite={slides.length > 1}
            autoPlay={slides.length > 1}
            autoPlaySpeed={3000}
            showDots={false}
            arrows={false}
            containerClass="carousel-container"
          >
            {slides.map((slide, index) => (
              <div key={slide._id || index} className="relative p-2">
                <div className="relative w-full h-[300px] sm:h-[400px] rounded-lg shadow-lg overflow-hidden bg-black">
                  <img
                    src={getImageUrl(slide.image)}
                    alt={slide.text || `Category slider ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      console.error('Image failed to load:', slide.image);
                    }}
                  />
                  {/* Black background overlay with text */}
                  {slide.text && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-4">
                      <p className="text-sm sm:text-base font-medium">{slide.text}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
}
 