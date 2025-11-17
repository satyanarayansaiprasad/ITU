import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, RotateCcw, RotateCw, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const PlayerIDCard = ({ player }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (/^(https?|data):/i.test(image)) return image;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                        (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');
    if (image.startsWith('uploads/')) return `${API_BASE_URL}/${image}`;
    const cleanImage = image.replace(/^\/+/, '');
    return `${API_BASE_URL}/uploads/${cleanImage}`;
  };

  const downloadCard = async () => {
    if (!cardRef.current || !frontRef.current || !backRef.current) {
      toast.error('ID card elements not found');
      return;
    }

    try {
      setIsDownloading(true);
      toast.info('Preparing ID card download...');
      
      // Download both sides as separate images
      await downloadSide('front');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between downloads
      await downloadSide('back');
      
      toast.success('ID card downloaded successfully!');
    } catch (error) {
      console.error('Error downloading ID card:', error);
      toast.error('Failed to download ID card. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadSide = async (side) => {
    const element = side === 'front' ? frontRef.current : backRef.current;
    if (!element) {
      throw new Error(`${side} side element not found`);
    }

    // Create a temporary container to capture the correct side
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '525px';
    tempContainer.style.height = '330px';
    tempContainer.style.backgroundColor = '#1e3a8a'; // Use hex color instead of oklch
    tempContainer.style.overflow = 'hidden';
    document.body.appendChild(tempContainer);

    // Clone the element and its children
    const clonedElement = element.cloneNode(true);
    
    // Reset all transforms and positioning
    clonedElement.style.transform = 'none';
    clonedElement.style.position = 'relative';
    clonedElement.style.backfaceVisibility = 'visible';
    clonedElement.style.WebkitBackfaceVisibility = 'visible';
    clonedElement.style.opacity = '1';
    clonedElement.style.visibility = 'visible';
    
    // Comprehensive function to recursively process all elements and set explicit hex colors
    const processElementColors = (el) => {
      if (!el || el.nodeType !== 1) return; // Skip non-element nodes
      
      try {
        // Get computed styles safely
        let computedStyle;
        try {
          computedStyle = window.getComputedStyle(el);
        } catch (e) {
          return; // Skip if we can't get computed style
        }
        
        // Process background color
        try {
          const bgColor = computedStyle.backgroundColor;
          if (bgColor) {
            if (bgColor.includes('oklch') || bgColor.includes('oklab') || 
                (!bgColor.startsWith('#') && !bgColor.startsWith('rgb') && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)')) {
              // Determine color based on element context
              const classList = Array.from(el.classList || []);
              if (classList.some(c => c.includes('blue') || c.includes('indigo'))) {
                el.style.backgroundColor = '#1e3a8a';
              } else if (classList.some(c => c.includes('white'))) {
                el.style.backgroundColor = '#ffffff';
              } else if (classList.some(c => c.includes('orange'))) {
                el.style.backgroundColor = '#fb923c';
              } else {
                el.style.backgroundColor = '#1e3a8a';
              }
            } else if (bgColor.startsWith('#') || bgColor.startsWith('rgb')) {
              el.style.backgroundColor = bgColor;
            }
          }
        } catch (e) {
          el.style.backgroundColor = '#1e3a8a';
        }
        
        // Process text color
        try {
          const textColor = computedStyle.color;
          if (textColor) {
            if (textColor.includes('oklch') || textColor.includes('oklab') || 
                (!textColor.startsWith('#') && !textColor.startsWith('rgb'))) {
              const classList = Array.from(el.classList || []);
              if (classList.some(c => c.includes('white'))) {
                el.style.color = '#ffffff';
              } else if (classList.some(c => c.includes('orange'))) {
                el.style.color = '#fb923c';
              } else {
                el.style.color = '#ffffff';
              }
            } else if (textColor.startsWith('#') || textColor.startsWith('rgb')) {
              el.style.color = textColor;
            }
          }
        } catch (e) {
          el.style.color = '#ffffff';
        }
        
        // Process border color
        try {
          const borderColor = computedStyle.borderColor;
          if (borderColor && (borderColor.includes('oklch') || borderColor.includes('oklab') || 
              (!borderColor.startsWith('#') && !borderColor.startsWith('rgb') && borderColor !== 'transparent' && borderColor !== 'rgba(0, 0, 0, 0)'))) {
            el.style.borderColor = '#ffffff';
          } else if (borderColor && (borderColor.startsWith('#') || borderColor.startsWith('rgb'))) {
            el.style.borderColor = borderColor;
          }
        } catch (e) {
          // Ignore border color errors
        }
        
        // Process all children recursively
        Array.from(el.children).forEach(child => processElementColors(child));
      } catch (e) {
        // Continue processing children even if this element fails
        Array.from(el.children).forEach(child => processElementColors(child));
      }
    };
    
    // Get the inner card div and fix all color references
    const innerCard = clonedElement.querySelector('div > div');
    if (innerCard) {
      innerCard.style.transform = 'none';
      innerCard.style.position = 'relative';
      
      // Process all elements recursively to set explicit hex colors
      processElementColors(innerCard);
      
      // Helper function to safely get and convert color values
      const safeGetColor = (colorValue, defaultColor = '#1e3a8a') => {
        if (!colorValue || colorValue === 'transparent' || colorValue === 'rgba(0, 0, 0, 0)') {
          return 'transparent';
        }
        // If it's already hex or rgb, return as is
        if (colorValue.startsWith('#') || colorValue.startsWith('rgb')) {
          return colorValue;
        }
        // If it contains oklch or oklab (modern CSS color functions), convert to hex
        if (colorValue.includes('oklch') || colorValue.includes('oklab')) {
          return defaultColor;
        }
        // For any other format, return default
        return defaultColor;
      };
      
      // Helper function to convert any color to RGB/hex
      const convertColorToHex = (colorValue) => {
        if (!colorValue || colorValue === 'transparent' || colorValue === 'rgba(0, 0, 0, 0)') {
          return 'transparent';
        }
        // If it's already hex or rgb, return as is
        if (colorValue.startsWith('#') || colorValue.startsWith('rgb')) {
          return colorValue;
        }
        // If it contains oklch or oklab (modern CSS color functions), convert to hex
        if (colorValue.includes('oklch') || colorValue.includes('oklab')) {
          // Try to extract approximate color from context
          if (colorValue.includes('blue') || colorValue.includes('indigo')) {
            return '#1e3a8a';
          }
          if (colorValue.includes('white')) {
            return '#ffffff';
          }
          if (colorValue.includes('orange')) {
            return '#fb923c';
          }
          return '#1e3a8a'; // Default blue
        }
        return colorValue;
      };
      
      // Replace all computed styles with explicit hex/rgb colors
      // Process all elements and set explicit styles to avoid oklch/oklab parsing
      const allElements = innerCard.querySelectorAll('*');
      allElements.forEach(el => {
        try {
          // Get computed styles from the original element (before cloning)
          const originalEl = element.querySelector(
            el.tagName.toLowerCase() + 
            (el.id ? `#${el.id}` : '') + 
            (el.className ? `.${el.className.split(' ').join('.')}` : '')
          ) || el;
          
          let computedStyle;
          try {
            computedStyle = window.getComputedStyle(originalEl);
          } catch (e) {
            // If we can't get computed style, skip this element
            return;
          }
          
          // Set explicit background color - convert ALL colors to hex/rgb to avoid oklch/oklab
          let bgColor;
          try {
            bgColor = computedStyle.backgroundColor;
            // Check if it contains unsupported color functions
            if (bgColor && (bgColor.includes('oklch') || bgColor.includes('oklab'))) {
              // Convert modern color functions to hex based on context
              if (bgColor.includes('blue') || bgColor.includes('indigo')) {
                el.style.backgroundColor = '#1e3a8a';
              } else if (bgColor.includes('white')) {
                el.style.backgroundColor = '#ffffff';
              } else if (bgColor.includes('orange')) {
                el.style.backgroundColor = '#fb923c';
              } else {
                el.style.backgroundColor = '#1e3a8a';
              }
            } else if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
              // Only set if it's a valid hex/rgb color
              if (bgColor.startsWith('#') || bgColor.startsWith('rgb')) {
                el.style.backgroundColor = bgColor;
              } else {
                // Unknown format, use safe default
                el.style.backgroundColor = '#1e3a8a';
              }
            }
          } catch (e) {
            // If reading backgroundColor fails (due to oklab), set safe default
            el.style.backgroundColor = '#1e3a8a';
          }
          
          // Set explicit text color - convert ALL colors to hex/rgb
          let textColor;
          try {
            textColor = computedStyle.color;
            if (textColor && (textColor.includes('oklch') || textColor.includes('oklab'))) {
              if (textColor.includes('white')) {
                el.style.color = '#ffffff';
              } else if (textColor.includes('orange')) {
                el.style.color = '#fb923c';
              } else {
                el.style.color = '#ffffff';
              }
            } else if (textColor) {
              if (textColor.startsWith('#') || textColor.startsWith('rgb')) {
                el.style.color = textColor;
              } else {
                // Unknown format, use safe default
                el.style.color = '#ffffff';
              }
            }
          } catch (e) {
            // If reading color fails (due to oklab), set safe default
            el.style.color = '#ffffff';
          }
          
          // Set explicit border color
          let borderColor;
          try {
            borderColor = computedStyle.borderColor;
            if (borderColor && (borderColor.includes('oklch') || borderColor.includes('oklab'))) {
              el.style.borderColor = '#ffffff';
            } else if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') {
              if (borderColor.startsWith('#') || borderColor.startsWith('rgb')) {
                el.style.borderColor = borderColor;
              } else {
                el.style.borderColor = '#ffffff';
              }
            }
          } catch (e) {
            // If reading borderColor fails, set safe default
            el.style.borderColor = '#ffffff';
          }
        } catch (e) {
          // Ignore errors for individual elements
        }
      });
    }
    
    tempContainer.appendChild(clonedElement);
    
    // Process the entire cloned element tree again after it's in the DOM
    // This ensures all computed styles are converted to explicit hex colors
    const finalProcessColors = (el) => {
      if (!el || el.nodeType !== 1) return;
      
      try {
        // Remove any Tailwind classes that might generate oklch colors
        // Keep only essential classes
        const classesToKeep = ['rounded', 'overflow', 'flex', 'grid', 'absolute', 'relative'];
        const currentClasses = Array.from(el.classList || []);
        currentClasses.forEach(cls => {
          // Remove color-related classes that might generate oklch
          if (cls.includes('bg-') || cls.includes('text-') || cls.includes('border-') || 
              cls.includes('from-') || cls.includes('via-') || cls.includes('to-') ||
              cls.includes('gradient')) {
            el.classList.remove(cls);
          }
        });
        
        // Get computed style and set explicit hex colors
        try {
          const style = window.getComputedStyle(el);
          
          // Force set background color as hex
          try {
            const bg = style.backgroundColor;
            if (bg && (bg.includes('oklch') || bg.includes('oklab') || 
                (!bg.startsWith('#') && !bg.startsWith('rgb') && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)'))) {
              el.style.setProperty('background-color', '#1e3a8a', 'important');
            } else if (bg && (bg.startsWith('#') || bg.startsWith('rgb'))) {
              el.style.setProperty('background-color', bg, 'important');
            }
          } catch (e) {
            el.style.setProperty('background-color', '#1e3a8a', 'important');
          }
          
          // Force set text color as hex
          try {
            const color = style.color;
            if (color && (color.includes('oklch') || color.includes('oklab') || 
                (!color.startsWith('#') && !color.startsWith('rgb')))) {
              el.style.setProperty('color', '#ffffff', 'important');
            } else if (color && (color.startsWith('#') || color.startsWith('rgb'))) {
              el.style.setProperty('color', color, 'important');
            }
          } catch (e) {
            el.style.setProperty('color', '#ffffff', 'important');
          }
          
          // Force set border color as hex
          try {
            const border = style.borderColor;
            if (border && (border.includes('oklch') || border.includes('oklab') || 
                (!border.startsWith('#') && !border.startsWith('rgb') && border !== 'transparent' && border !== 'rgba(0, 0, 0, 0)'))) {
              el.style.setProperty('border-color', '#ffffff', 'important');
            } else if (border && (border.startsWith('#') || border.startsWith('rgb'))) {
              el.style.setProperty('border-color', border, 'important');
            }
          } catch (e) {
            // Ignore border errors
          }
        } catch (e) {
          // Set safe defaults
          el.style.setProperty('background-color', '#1e3a8a', 'important');
          el.style.setProperty('color', '#ffffff', 'important');
        }
        
        // Process children
        Array.from(el.children).forEach(child => finalProcessColors(child));
      } catch (e) {
        // Continue with children
        Array.from(el.children).forEach(child => finalProcessColors(child));
      }
    };
    
    // Process the entire tree after it's in the DOM
    finalProcessColors(clonedElement);

    try {
      // Wait for images to load and styles to be applied
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#1e3a8a', // Use hex color
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: false,
        width: 525,
        height: 330,
        windowWidth: 525,
        windowHeight: 330,
        ignoreElements: (element) => {
          // Ignore elements that might cause issues
          return element.classList && element.classList.contains('animate-shine');
        },
        onclone: (clonedDoc) => {
          // Final pass: remove CSS classes and convert all oklch/oklab colors to hex/rgb
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach(el => {
            try {
              // Remove all CSS classes that might generate oklch colors
              // This prevents html2canvas from reading stylesheets with oklch
              const classesToRemove = Array.from(el.classList || []);
              classesToRemove.forEach(cls => {
                if (cls.includes('bg-') || cls.includes('text-') || cls.includes('border-') || 
                    cls.includes('from-') || cls.includes('via-') || cls.includes('to-') ||
                    cls.includes('gradient') || cls.includes('blue') || cls.includes('indigo') ||
                    cls.includes('white') || cls.includes('orange')) {
                  el.classList.remove(cls);
                }
              });
              
              // Try to get computed style, but if it fails or contains oklch, use defaults
              let bgColor, textColor, borderColor;
              try {
                const style = window.getComputedStyle(el);
                bgColor = style.backgroundColor;
                textColor = style.color;
                borderColor = style.borderColor;
              } catch (e) {
                // If we can't read computed style, use defaults
                bgColor = null;
                textColor = null;
                borderColor = null;
              }
              
              // Convert background colors - handle both oklch and oklab
              if (bgColor && (bgColor.includes('oklch') || bgColor.includes('oklab') || 
                  (!bgColor.startsWith('#') && !bgColor.startsWith('rgb') && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)'))) {
                // Use inline style with !important to override
                el.style.setProperty('background-color', '#1e3a8a', 'important');
              } else if (bgColor && (bgColor.startsWith('#') || bgColor.startsWith('rgb'))) {
                el.style.setProperty('background-color', bgColor, 'important');
              } else {
                // Set default if no valid color
                el.style.setProperty('background-color', '#1e3a8a', 'important');
              }
              
              // Convert text colors - handle both oklch and oklab
              if (textColor && (textColor.includes('oklch') || textColor.includes('oklab') || 
                  (!textColor.startsWith('#') && !textColor.startsWith('rgb')))) {
                el.style.setProperty('color', '#ffffff', 'important');
              } else if (textColor && (textColor.startsWith('#') || textColor.startsWith('rgb'))) {
                el.style.setProperty('color', textColor, 'important');
              } else {
                el.style.setProperty('color', '#ffffff', 'important');
              }
              
              // Convert border colors - handle both oklch and oklab
              if (borderColor && (borderColor.includes('oklch') || borderColor.includes('oklab') || 
                  (!borderColor.startsWith('#') && !borderColor.startsWith('rgb') && borderColor !== 'transparent' && borderColor !== 'rgba(0, 0, 0, 0)'))) {
                el.style.setProperty('border-color', '#ffffff', 'important');
              } else if (borderColor && (borderColor.startsWith('#') || borderColor.startsWith('rgb'))) {
                el.style.setProperty('border-color', borderColor, 'important');
              }
            } catch (e) {
              // Set safe defaults on error
              try {
                el.style.setProperty('background-color', '#1e3a8a', 'important');
                el.style.setProperty('color', '#ffffff', 'important');
              } catch (e2) {
                // Final fallback - ignore
              }
            }
          });
        },
      });

      const link = document.createElement('a');
      const sanitizedName = player.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${sanitizedName}_ID_Card_${side}_${Date.now()}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 1.0);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    } catch (error) {
      console.error(`Error downloading ${side} side:`, error);
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
      throw error;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="text-blue-600" size={28} />
            Player ID Card
          </h2>
          <p className="text-sm text-gray-600 mt-1">Premium 3D ID Card - View front and back</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isFlipped ? (
              <>
                <RotateCcw size={18} />
                View Front
              </>
            ) : (
              <>
                <RotateCw size={18} />
                View Back
              </>
            )}
          </button>
          <button
            onClick={downloadCard}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            {isDownloading ? 'Downloading...' : 'Download ID Card'}
          </button>
        </div>
      </div>

      {/* 3D Card Container */}
      <div className="flex items-center justify-center min-h-[600px] perspective-1000">
        <div
          ref={cardRef}
          className="relative w-full max-w-[525px] h-[330px] preserve-3d"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)',
          }}
        >
          {/* Front Side */}
          <div
            ref={frontRef}
            className="absolute inset-0 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              {/* Premium Gradient Background */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af, #312e81)' }}>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full p-6 flex flex-col">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm p-2 border-2 border-white/30">
                      <img
                        src="/ITU LOGO.png"
                        alt="ITU Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">INDIAN TAEKWONDO</h3>
                      <h3 className="text-orange-400 font-bold text-lg leading-tight">UNION</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-xs font-semibold">PLAYER ID CARD</p>
                    <p className="text-orange-400 text-xs font-bold mt-1">{player.playerId || 'N/A'}</p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center gap-6">
                  {/* Photo Section */}
                  <div className="relative">
                    <div className="w-32 h-40 rounded-lg overflow-hidden border-4 border-white/50 shadow-xl bg-white/10 backdrop-blur-sm">
                      {player.photo ? (
                        <img
                          src={getImageUrl(player.photo)}
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center" style={{ display: player.photo ? 'none' : 'flex' }}>
                        <span className="text-white text-4xl font-bold">{player.name.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Name</p>
                      <p className="text-white font-bold text-xl">{player.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">State</p>
                        <p className="text-white font-semibold">{player.state}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">District</p>
                        <p className="text-white font-semibold">{player.district}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Union</p>
                      <p className="text-white font-semibold text-sm">{player.unionName || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center pt-3 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">ITU</span>
                    </div>
                    <p className="text-white/80 text-xs">Official Player</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div
            ref={backRef}
            className="absolute inset-0 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              {/* Premium Gradient Background */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #312e81, #1e40af, #1e3a8a)' }}>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full p-5 flex flex-col">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="inline-block mb-2">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm p-2 border-2 border-white/30 mx-auto">
                      <img
                        src="/ITU LOGO.png"
                        alt="ITU Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">INDIAN TAEKWONDO UNION</h3>
                  <p className="text-orange-400 text-xs font-semibold">Official Player Identification Card</p>
                </div>

                {/* Player Details - No Boxes */}
                <div className="flex-1 space-y-3 px-2 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Date of Birth</p>
                      <p className="text-white font-bold text-sm">{formatDate(player.dob)}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Belt Level</p>
                      <p className="text-white font-bold text-sm">{player.beltLevel || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Email</p>
                      <p className="text-white font-semibold text-xs break-words leading-tight">{player.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-white font-semibold text-sm">{player.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Footer - Minimal */}
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-white/40 text-xs">This card is the property of Indian Taekwondo Union</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default PlayerIDCard;

