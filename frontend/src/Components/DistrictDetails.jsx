import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Building2, Phone, MapPin, Award, User, Mail, ArrowLeft, ExternalLink, Globe, Calendar, Crown, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

const DistrictDetails = () => {
  const { stateName, districtName } = useParams();
  const navigate = useNavigate();
  const [districtHead, setDistrictHead] = useState(null);
  const [stateHead, setStateHead] = useState(null);
  const [unions, setUnions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnion, setSelectedUnion] = useState(null);
  const idCardRef = useRef(null);

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        setLoading(true);
        
        // Decode the district name properly in case of URL encoding issues
        const decodedDistrictName = decodeURIComponent(districtName || '');
        const decodedStateName = decodeURIComponent(stateName || '');
        
        console.log('Fetching district data for:', decodedStateName, decodedDistrictName);
        
        const response = await axios.get(
          API_ENDPOINTS.GET_ORGANIZATIONS_BY_DISTRICT(decodedStateName, decodedDistrictName)
        );

        if (response.data && response.data.success) {
          const organizations = response.data.data || [];
          console.log('Organizations found:', organizations.length);
          
          // Find district head
          const head = organizations.find(org => org.isDistrictHead);
          setDistrictHead(head || null);
          
          // Get all unions (including district head in the list)
          setUnions(organizations);
        } else {
          console.warn('No organizations found or invalid response:', response.data);
          setUnions([]);
          setDistrictHead(null);
        }
        
        // Fetch state head
        try {
          const orgResponse = await axios.get(API_ENDPOINTS.GET_ORGANIZATIONS_BY_STATE(decodedStateName));
          if (orgResponse.data && orgResponse.data.success) {
            const head = orgResponse.data.data.find(org => org.isStateHead);
            if (head) {
              setStateHead(head);
            }
          }
        } catch (err) {
          console.error(`Error fetching state head for ${decodedStateName}:`, err);
        }
      } catch (error) {
        console.error('Error fetching district data:', error);
        console.error('Error details:', error.response?.data || error.message);
        // Set empty state on error to prevent blank screen
        setUnions([]);
        setDistrictHead(null);
        setStateHead(null);
      } finally {
        setLoading(false);
      }
    };

    if (stateName && districtName) {
      fetchDistrictData();
    } else {
      setLoading(false);
    }
  }, [stateName, districtName]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/${imagePath}`;
  };

  const downloadIdCard = async () => {
    if (!idCardRef.current || !selectedUnion) return;
    
    try {
      // Pre-process: Convert all computed styles to inline styles to avoid oklch issues
      const element = idCardRef.current;
      const allElements = element.querySelectorAll('*');
      
      // Store original styles to restore later
      const originalStyles = new Map();
      
      // Set fixed dimensions for consistent ID card across all devices
      const originalWidth = element.style.width;
      const originalMinWidth = element.style.minWidth;
      const originalMaxWidth = element.style.maxWidth;
      element.style.width = '800px';
      element.style.minWidth = '800px';
      element.style.maxWidth = '800px';
      
      // Apply fixed styles to key elements
      const photoContainer = element.querySelector('.id-card-photo');
      const photoImg = element.querySelector('.id-card-img');
      const title = element.querySelector('.id-card-title');
      const secretaryName = element.querySelector('.id-card-secretary-name');
      const location = element.querySelector('.id-card-location');
      const address = element.querySelector('.id-card-address');
      const header = element.querySelector('.id-card-header');
      
      if (photoImg) {
        originalStyles.set(photoImg, {
          width: photoImg.style.width,
          height: photoImg.style.height,
        });
        photoImg.style.width = '160px';
        photoImg.style.height = '160px';
      }
      
      if (title) {
        originalStyles.set(title, {
          fontSize: title.style.fontSize,
        });
        title.style.fontSize = '32px';
      }
      
      if (secretaryName) {
        originalStyles.set(secretaryName, {
          fontSize: secretaryName.style.fontSize,
        });
        secretaryName.style.fontSize = '14px';
      }
      
      if (location) {
        originalStyles.set(location, {
          fontSize: location.style.fontSize,
        });
        location.style.fontSize = '16px';
      }
      
      if (address) {
        originalStyles.set(address, {
          fontSize: address.style.fontSize,
        });
        address.style.fontSize = '16px';
      }
      
      if (header) {
        originalStyles.set(header, {
          flexDirection: header.style.flexDirection,
        });
        header.style.flexDirection = 'row';
      }
      
      // Convert all styles to inline RGB - including gradients and all color properties
      allElements.forEach((el) => {
        try {
          const styles = window.getComputedStyle(el);
          const styleMap = {};
          
          // Helper to convert color using canvas
          const convertColor = (colorValue) => {
            if (!colorValue || colorValue === 'transparent' || colorValue === 'rgba(0, 0, 0, 0)') {
              return colorValue;
            }
            if (typeof colorValue === 'string' && colorValue.toLowerCase().includes('oklch')) {
              try {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = colorValue;
                ctx.fillRect(0, 0, 1, 1);
                const imageData = ctx.getImageData(0, 0, 1, 1);
                const [r, g, b, a] = imageData.data;
                if (a < 255) {
                  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
                }
                return `rgb(${r}, ${g}, ${b})`;
              } catch (e) {
                // Fallback to a safe color
                return '#000000';
              }
            }
            return colorValue;
          };
          
          // Convert all color-related properties
          const colorProperties = [
            'backgroundColor', 'color', 'borderColor', 'borderTopColor', 
            'borderRightColor', 'borderBottomColor', 'borderLeftColor',
            'outlineColor', 'textDecorationColor', 'columnRuleColor'
          ];
          
          colorProperties.forEach(prop => {
            const value = styles[prop];
            if (value && typeof value === 'string' && value.toLowerCase().includes('oklch')) {
              const converted = convertColor(value);
              if (converted !== value) {
                styleMap[prop] = el.style[prop] || '';
                el.style[prop] = converted;
              }
            }
          });
          
          // Handle background-image gradients that might contain oklch
          const bgImage = styles.backgroundImage;
          if (bgImage && bgImage !== 'none' && bgImage.toLowerCase().includes('oklch')) {
            // Replace gradient with solid color
            const bgColor = convertColor(styles.backgroundColor);
            styleMap.backgroundImage = el.style.backgroundImage || '';
            el.style.backgroundImage = 'none';
            if (bgColor) {
              styleMap.backgroundColor = el.style.backgroundColor || '';
              el.style.backgroundColor = bgColor;
            }
          }
          
          if (Object.keys(styleMap).length > 0) {
            originalStyles.set(el, styleMap);
          }
        } catch (e) {
          // Ignore errors
        }
      });
      
      // Wait a bit for styles to apply
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Ensure element has white background
      const originalBg = element.style.backgroundColor;
      element.style.backgroundColor = '#ffffff';
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 800,
        height: element.scrollHeight,
        logging: false,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Ensure all elements in cloned document have white background
          const body = clonedDoc.body;
          if (body) {
            body.style.backgroundColor = '#ffffff';
            // Find the main content div (the one with id-card-container class)
            const mainDiv = body.querySelector('.id-card-container') || body.querySelector('div');
            if (mainDiv) {
              mainDiv.style.backgroundColor = '#ffffff';
              mainDiv.style.width = '800px';
              mainDiv.style.minWidth = '800px';
              mainDiv.style.maxWidth = '800px';
              
              // Apply fixed styles in cloned document
              const clonedPhotoImg = mainDiv.querySelector('.id-card-img');
              const clonedTitle = mainDiv.querySelector('.id-card-title');
              const clonedSecretaryName = mainDiv.querySelector('.id-card-secretary-name');
              const clonedLocation = mainDiv.querySelector('.id-card-location');
              const clonedAddress = mainDiv.querySelector('.id-card-address');
              const clonedHeader = mainDiv.querySelector('.id-card-header');
              
              if (clonedPhotoImg) {
                clonedPhotoImg.style.width = '160px';
                clonedPhotoImg.style.height = '160px';
              }
              
              if (clonedTitle) {
                clonedTitle.style.fontSize = '32px';
              }
              
              if (clonedSecretaryName) {
                clonedSecretaryName.style.fontSize = '14px';
              }
              
              if (clonedLocation) {
                clonedLocation.style.fontSize = '16px';
              }
              
              if (clonedAddress) {
                clonedAddress.style.fontSize = '16px';
              }
              
              if (clonedHeader) {
                clonedHeader.style.flexDirection = 'row';
              }
              
              // Ensure all child elements with transparent/black backgrounds get white
              const allElements = mainDiv.querySelectorAll('*');
              allElements.forEach((el) => {
                try {
                  const styles = clonedDoc.defaultView.getComputedStyle(el);
                  const bg = styles.backgroundColor;
                  // If background is transparent or black, set to white
                  if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' || bg === 'rgb(0, 0, 0)' || bg === 'rgba(0, 0, 0, 1)') {
                    el.style.backgroundColor = '#ffffff';
                  }
                } catch (e) {
                  // Ignore errors
                }
              });
            }
          }
        }
      });
      
      // Restore original dimensions
      if (originalWidth) {
        element.style.width = originalWidth;
      } else {
        element.style.removeProperty('width');
      }
      if (originalMinWidth) {
        element.style.minWidth = originalMinWidth;
      } else {
        element.style.removeProperty('minWidth');
      }
      if (originalMaxWidth) {
        element.style.maxWidth = originalMaxWidth;
      } else {
        element.style.removeProperty('maxWidth');
      }
      
      // Restore original background
      if (originalBg) {
        element.style.backgroundColor = originalBg;
      } else {
        element.style.removeProperty('backgroundColor');
      }
      
      // Restore original styles
      originalStyles.forEach((styles, el) => {
        Object.entries(styles).forEach(([prop, value]) => {
          if (value) {
            el.style[prop] = value;
          } else {
            el.style.removeProperty(prop);
          }
        });
      });
      
      const link = document.createElement('a');
      const fileName = `${selectedUnion.name.replace(/\s+/g, '_')}_ID_Card.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating ID card:', error);
      alert('Failed to download ID card. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading district information...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasData = districtHead || unions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[100px] sm:pt-[120px] md:pt-[130px] pb-8 sm:pb-12 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(`/state-union/${stateName}`)}
            className="mb-4 flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Districts
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">{districtName}</h1>
          <p className="text-lg sm:text-xl text-gray-600">{stateName}</p>
        </motion.div>

        {/* State Head Section */}
        {stateHead && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden relative"
          >
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <Crown className="w-5 h-5" />
                <span className="font-bold text-sm">State Head</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {stateHead.generalSecretaryImage && (
                  <div className="flex-shrink-0">
                    <div className="text-center">
                      <img
                        src={getImageUrl(stateHead.generalSecretaryImage)}
                        alt="General Secretary"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover border-4 border-yellow-500 shadow-xl mx-auto"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <p className="text-sm font-semibold text-gray-700 mt-3">{stateHead.secretaryName || 'General Secretary'}</p>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    {stateHead.name}
                  </h3>
                  {stateHead.state && (
                    <p className="text-base text-gray-600 font-medium mb-4">
                      {stateHead.state}
                    </p>
                  )}
                  {stateHead.headOfficeAddress && (
                    <div className="flex items-start gap-2 text-gray-700 mb-4">
                      <MapPin className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <span className="font-semibold leading-relaxed">{stateHead.headOfficeAddress}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {stateHead.phone && (
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                        <div className="bg-green-200 rounded-lg p-2">
                          <Phone className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Contact Phone</p>
                          <a href={`tel:${stateHead.phone}`} className="text-base font-bold text-gray-800 hover:text-green-700 transition-colors">
                            {stateHead.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {stateHead.email && (
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                        <div className="bg-purple-200 rounded-lg p-2">
                          <Mail className="w-5 h-5 text-purple-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Email Address</p>
                          <a href={`mailto:${stateHead.email}`} className="text-base font-bold text-gray-800 hover:text-purple-700 transition-colors break-all">
                            {stateHead.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!hasData ? (
          // No data available - Show contact us message
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 text-center"
          >
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <Building2 className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  No Organizations Available
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                  There are currently no organizations registered in this district.
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 sm:p-8 text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Join Our Organization</h3>
                <p className="text-base sm:text-lg mb-6 opacity-90">
                  Be a part of the Indian Taekwondo Union. Register your organization today!
                </p>
                <button
                  onClick={() => navigate('/forms')}
                  className="bg-white text-orange-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
                >
                  <ExternalLink className="w-5 h-5" />
                  Fill Affiliation Form
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* District Head Section */}
            {districtHead ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden relative"
              >
                {/* District Head Badge - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    <span className="font-bold text-sm">District Head</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {districtHead.generalSecretaryImage && (
                      <div className="flex-shrink-0">
                        <div className="text-center">
                          <img
                            src={getImageUrl(districtHead.generalSecretaryImage)}
                            alt={union.isStateHead ? "General Secretary" : "Secretary"}
                            className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover border-4 border-orange-500 shadow-xl mx-auto"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <p className="text-sm font-semibold text-gray-700 mt-3">{districtHead.secretaryName || 'General Secretary'}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 leading-tight">
                        {districtHead.name}
                      </h3>
                      {districtHead.district && districtHead.state && (
                        <p className="text-base text-gray-600 font-medium mb-4">
                          {districtHead.district}, {districtHead.state}
                        </p>
                      )}
                      {districtHead.headOfficeAddress && (
                        <div className="flex items-start gap-2 text-gray-700 mb-4">
                          <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                          <span className="font-semibold leading-relaxed">{districtHead.headOfficeAddress}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {districtHead.presidentName && (
                          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                            <div className="bg-blue-200 rounded-lg p-2">
                              <User className="w-5 h-5 text-blue-700" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">President Name</p>
                              <p className="text-base font-bold text-gray-800">{districtHead.presidentName}</p>
                            </div>
                          </div>
                        )}
                        {districtHead.phone && (
                          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                            <div className="bg-green-200 rounded-lg p-2">
                              <Phone className="w-5 h-5 text-green-700" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Contact Phone</p>
                              <a href={`tel:${districtHead.phone}`} className="text-base font-bold text-gray-800 hover:text-green-700 transition-colors">
                                {districtHead.phone}
                              </a>
                            </div>
                          </div>
                        )}
                        {districtHead.email && (
                          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 md:col-span-2">
                            <div className="bg-purple-200 rounded-lg p-2">
                              <Mail className="w-5 h-5 text-purple-700" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Email Address</p>
                              <a href={`mailto:${districtHead.email}`} className="text-base font-bold text-gray-800 hover:text-purple-700 transition-colors break-all">
                                {districtHead.email}
                              </a>
                            </div>
                          </div>
                        )}
                        {districtHead.establishedDate && (
                          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                            <div className="bg-yellow-200 rounded-lg p-2">
                              <Calendar className="w-5 h-5 text-yellow-700" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Established Year</p>
                              <p className="text-base font-bold text-gray-800">
                                {new Date(districtHead.establishedDate).getFullYear()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg mb-8 p-6 text-center"
              >
                <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-6">
                  <p className="text-lg font-semibold text-amber-800">District Head - Coming Soon</p>
                </div>
              </motion.div>
            )}

            {/* Unions List */}
            {unions.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    Available Unions ({unions.length})
                  </h2>
                </div>
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {unions.map((union, index) => (
                    <motion.div
                      key={union._id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => setSelectedUnion(union)}
                      className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-orange-500 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {union.generalSecretaryImage ? (
                          <img
                            src={getImageUrl(union.generalSecretaryImage)}
                            alt={union.isStateHead ? "General Secretary" : "Secretary"}
                            className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-orange-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-800">{union.name}</h3>
                            {union.isDistrictHead && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full">
                                <Award className="w-3 h-3" />
                                District Head
                              </span>
                            )}
                          </div>
                          {union.phone && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {union.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      {union.headOfficeAddress && (
                        <p className="text-sm text-gray-600 flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{union.headOfficeAddress}</span>
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-xs text-orange-600 font-semibold">Click to view details →</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <p className="text-lg text-gray-600 mb-6">No other unions available in this district.</p>
                <button
                  onClick={() => navigate('/forms')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-colors"
                >
                  Join Our Organization
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Union Detail Modal */}
        {selectedUnion && (
          <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setSelectedUnion(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Union Details</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={downloadIdCard}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                    title="Download ID Card"
                  >
                    <Download className="w-5 h-5" />
                    <span className="hidden sm:inline">Download ID Card</span>
                  </button>
                  <button
                    onClick={() => setSelectedUnion(null)}
                    className="text-white hover:text-gray-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 relative bg-white id-card-container" ref={idCardRef} style={{ backgroundColor: '#ffffff' }}>
                {/* Transparent Logo Background */}
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: 'url(/ITU LOGO.png)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px 200px',
                    backgroundPosition: 'center',
                    backgroundColor: '#ffffff'
                  }}
                />
                <div className="relative z-10" style={{ backgroundColor: 'transparent' }}>
                {/* Header Section: Secretary Photo and Organization Name */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 pb-6 border-b-2 border-gray-200 id-card-header">
                  {/* Secretary Photo - Left Side */}
                  <div className="flex-shrink-0 id-card-photo">
                    {selectedUnion.generalSecretaryImage ? (
                      <div className="text-center">
                        <img
                          src={getImageUrl(selectedUnion.generalSecretaryImage)}
                          alt="Secretary"
                          className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover border-4 border-orange-500 shadow-xl mx-auto id-card-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="w-40 h-40 rounded-lg bg-orange-100 flex items-center justify-center border-4 border-orange-500 shadow-xl mx-auto hidden">
                          <User className="w-20 h-20 text-orange-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mt-3 id-card-secretary-name">{selectedUnion.secretaryName || (selectedUnion.isStateHead ? 'General Secretary' : 'Secretary')}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-40 h-40 rounded-lg bg-orange-100 flex items-center justify-center border-4 border-orange-500 shadow-xl mx-auto">
                          <User className="w-20 h-20 text-orange-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mt-3 id-card-secretary-name">{selectedUnion.secretaryName || (selectedUnion.isStateHead ? 'General Secretary' : 'Secretary')}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Organization Info - Right Side */}
                  <div className="flex-1 flex flex-col justify-center id-card-info">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight flex-1 id-card-title">
                        {selectedUnion.name}
                      </h3>
                      {/* District/State Head Badges */}
                      {selectedUnion.isDistrictHead && (
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 id-card-badge">
                          <Crown className="w-5 h-5" />
                          <span className="font-bold text-sm">District Head</span>
                        </div>
                      )}
                      {selectedUnion.isStateHead && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm font-bold rounded-full shadow-lg">
                          <Crown className="w-4 h-4" />
                          State Head
                        </span>
                      )}
                    </div>
                    {selectedUnion.district && selectedUnion.state && (
                      <div className="space-y-2">
                        <p className="text-base text-gray-600 font-medium id-card-location">
                          {selectedUnion.district}, {selectedUnion.state}
                        </p>
                        {(selectedUnion.headOfficeAddress || selectedUnion.address) && (
                          <p className="text-base text-gray-700 font-semibold leading-relaxed mt-1 id-card-address">
                            📍 {selectedUnion.headOfficeAddress || selectedUnion.address}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Organization Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 id-card-details">
                  {/* President Name */}
                  {selectedUnion.presidentName && (
                    <div className="flex items-start gap-3 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-blue-200 rounded-lg p-2">
                        <User className="w-6 h-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">President Name</p>
                        <p className="text-lg font-bold text-gray-800">{selectedUnion.presidentName}</p>
                      </div>
                    </div>
                  )}

                  {/* Contact Phone */}
                  {selectedUnion.phone && (
                    <div className="flex items-start gap-3 p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-green-200 rounded-lg p-2">
                        <Phone className="w-6 h-6 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Contact Phone</p>
                        <a href={`tel:${selectedUnion.phone}`} className="text-lg font-bold text-gray-800 hover:text-green-700 transition-colors">
                          {selectedUnion.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email Address */}
                  {selectedUnion.email && (
                    <div className="flex items-start gap-3 p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                      <div className="bg-purple-200 rounded-lg p-2">
                        <Mail className="w-6 h-6 text-purple-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Email Address</p>
                        <a href={`mailto:${selectedUnion.email}`} className="text-lg font-bold text-gray-800 hover:text-purple-700 transition-colors break-all">
                          {selectedUnion.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Established Year */}
                  {selectedUnion.establishedDate && (
                    <div className="flex items-start gap-3 p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-yellow-200 rounded-lg p-2">
                        <Calendar className="w-6 h-6 text-yellow-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Established Year</p>
                        <p className="text-lg font-bold text-gray-800">
                          {new Date(selectedUnion.establishedDate).getFullYear()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistrictDetails;


