import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_ENDPOINTS, GET_UPLOAD_URL } from '../../config/api';
const GalleryMng = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await axios.get(`API_ENDPOINTS.GET_GALLERY`);
      setSliderImages(response.data);
    //   console.log('Fetched sliders:', response.data); // Debugging
    } catch (error) {
      console.error('Error fetching sliders:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!newImage) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append('image', newImage);

    try {
      await axios.post(`API_ENDPOINTS.UPLOAD_GALLERY`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewImage(null);
      setPreview(null);
      fetchSliders();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;

    try {
      await axios.delete(`API_ENDPOINTS.DELETE_GALLERY(${id}`);
      fetchSliders();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  // Updated getImageUrl function
  const getImageUrl = (filename) => {
    if (!filename) return "/default-image.png";
    
    // If it's already a full URL, return it
    if (/^(https?|data):/i.test(filename)) return filename;
    
    // If it starts with /, return as is
    if (filename.startsWith('/')) return filename;
    
    // Otherwise construct the URL based on your server configuration
    // Choose one of these options:
    
    // Option 1: If images are served from a specific route (recommended)
    return `GET_UPLOAD_URL(${filename}`;
    
    // Option 2: If images are in public folder
    // return `/uploads/${filename}`;
  };

  const handleImageError = (id) => {
    console.log('Image load failed for slider:', id);
    setImageLoadErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Homepage Slider Management</h1>

      {/* Upload Section */}
      <div className="mb-8 border rounded p-4 bg-gray-100">
        <h2 className="font-semibold mb-2">Upload Slider Image</h2>
        <input 
          type="file" 
          onChange={handleImageChange} 
          accept="image/*" 
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="h-48 object-cover rounded" />
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={!newImage}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Upload
        </button>
      </div>

      {/* Slider List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Uploaded Sliders</h2>
        {sliderImages.length === 0 ? (
          <p className="text-gray-500">No slider images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sliderImages.map((slider) => {
              const imageUrl = getImageUrl(slider.filename);
              console.log(`Rendering slider ${slider._id} with URL:`, imageUrl); // Debugging
              
              return (
                <div key={slider._id} className="relative border rounded shadow overflow-hidden">
                  <img
                    src={imageLoadErrors[slider._id] ? "/default-image.png" : imageUrl}
                    onError={() => handleImageError(slider._id)}
                    alt={`Slider ${slider._id}`}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => handleDelete(slider._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryMng;