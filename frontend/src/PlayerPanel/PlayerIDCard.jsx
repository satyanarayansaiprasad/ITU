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

  // Helper function to convert any CSS color to RGB
  const colorToRgb = (colorValue) => {
    if (!colorValue || colorValue === 'none' || colorValue === 'transparent') {
      return null;
    }
    
    // If already RGB or hex, return as is
    if (colorValue.startsWith('#') || colorValue.startsWith('rgb')) {
      return colorValue;
    }
    
    // If contains oklab/oklch, use canvas trick to get RGB
    if (colorValue.includes('oklab') || colorValue.includes('oklch')) {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '1px';
        tempDiv.style.height = '1px';
        tempDiv.style.color = colorValue;
        document.body.appendChild(tempDiv);
        
        const computed = window.getComputedStyle(tempDiv);
        const rgb = computed.color;
        document.body.removeChild(tempDiv);
        
        // If still contains oklab, use fallback
        if (rgb.includes('oklab') || rgb.includes('oklch')) {
          return '#ffffff'; // Fallback to white
        }
        return rgb;
      } catch (e) {
        return '#ffffff'; // Fallback to white
      }
    }
    
    return colorValue;
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

    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '525px';
    tempContainer.style.height = '330px';
    tempContainer.style.backgroundColor = '#1e3a8a';
    tempContainer.style.overflow = 'hidden';
    document.body.appendChild(tempContainer);

    // Clone the element
    const clonedElement = element.cloneNode(true);
    
    // Reset transforms but keep visibility
    clonedElement.style.transform = 'none';
    clonedElement.style.position = 'relative';
    clonedElement.style.backfaceVisibility = 'visible';
    clonedElement.style.WebkitBackfaceVisibility = 'visible';
    clonedElement.style.opacity = '1';
    clonedElement.style.visibility = 'visible';
    clonedElement.style.display = 'block';
    clonedElement.style.zIndex = '1';
    
    // Simple function to apply styles from original to cloned element
    const applyStyles = (originalEl, clonedEl) => {
      if (!originalEl || !clonedEl || originalEl.nodeType !== 1 || clonedEl.nodeType !== 1) return;
      
      try {
        // Get computed styles from original
        const style = window.getComputedStyle(originalEl);
        
        // Remove ALL classes to prevent html2canvas from reading stylesheets with oklab
        clonedEl.className = '';
        clonedEl.removeAttribute('class');
        
        // Convert and apply colors using our helper function
        const bgColor = colorToRgb(style.backgroundColor);
        if (bgColor) {
          clonedEl.style.backgroundColor = bgColor;
        }
        
        const textColor = colorToRgb(style.color);
        if (textColor) {
          clonedEl.style.color = textColor;
        } else {
          clonedEl.style.color = '#ffffff'; // Fallback to white
        }
        
        const borderColor = colorToRgb(style.borderColor);
        if (borderColor && style.borderWidth !== '0px') {
          clonedEl.style.borderColor = borderColor;
        }
        
        // Background image - only if it doesn't contain oklab
        if (style.backgroundImage && style.backgroundImage !== 'none' && 
            !style.backgroundImage.includes('oklch') && !style.backgroundImage.includes('oklab')) {
          clonedEl.style.backgroundImage = style.backgroundImage;
        }
        
        // Typography - preserve all text styling
        clonedEl.style.fontSize = style.fontSize;
        clonedEl.style.fontWeight = style.fontWeight;
        clonedEl.style.fontFamily = style.fontFamily;
        clonedEl.style.lineHeight = style.lineHeight;
        clonedEl.style.textAlign = style.textAlign;
        clonedEl.style.letterSpacing = style.letterSpacing;
        clonedEl.style.textTransform = style.textTransform;
        clonedEl.style.textShadow = style.textShadow;
        
        // Layout and positioning
        clonedEl.style.padding = style.padding;
        clonedEl.style.margin = style.margin;
        clonedEl.style.borderRadius = style.borderRadius;
        clonedEl.style.display = style.display || 'block';
        clonedEl.style.flexDirection = style.flexDirection;
        clonedEl.style.alignItems = style.alignItems;
        clonedEl.style.justifyContent = style.justifyContent;
        clonedEl.style.gap = style.gap;
        clonedEl.style.width = style.width;
        clonedEl.style.height = style.height;
        clonedEl.style.position = style.position;
        clonedEl.style.top = style.top;
        clonedEl.style.left = style.left;
        clonedEl.style.right = style.right;
        clonedEl.style.bottom = style.bottom;
        clonedEl.style.zIndex = style.zIndex || '1';
        clonedEl.style.opacity = style.opacity || '1';
        clonedEl.style.visibility = style.visibility || 'visible';
        clonedEl.style.overflow = style.overflow;
        clonedEl.style.border = style.border;
        clonedEl.style.borderColor = style.borderColor;
        
        // Process children
        const originalChildren = Array.from(originalEl.children);
        const clonedChildren = Array.from(clonedEl.children);
        originalChildren.forEach((origChild, idx) => {
          if (clonedChildren[idx]) {
            applyStyles(origChild, clonedChildren[idx]);
          }
        });
      } catch (e) {
        // Continue with children
        const originalChildren = Array.from(originalEl.children);
        const clonedChildren = Array.from(clonedEl.children);
        originalChildren.forEach((origChild, idx) => {
          if (clonedChildren[idx]) {
            applyStyles(origChild, clonedChildren[idx]);
          }
        });
      }
    };
    
    // Apply styles from original to cloned
    applyStyles(element, clonedElement);
    
    // Get inner card and ensure it's visible
    const innerCard = clonedElement.querySelector('div > div');
    if (innerCard) {
      innerCard.style.transform = 'none';
      innerCard.style.position = 'relative';
      innerCard.style.opacity = '1';
      innerCard.style.visibility = 'visible';
      innerCard.style.display = 'block';
      innerCard.style.zIndex = '10';
    }
    
    // Add cloned element to container
    tempContainer.appendChild(clonedElement);
    
    // Force a reflow to ensure styles are applied
    tempContainer.offsetHeight;
    

    try {
      // Wait for images to load and styles to apply
      await new Promise(resolve => setTimeout(resolve, 800));

      // Before html2canvas, remove all style/link tags that might contain oklab
      const styleSheets = Array.from(document.styleSheets);
      const originalDisabled = [];
      styleSheets.forEach((sheet, idx) => {
        try {
          if (sheet.ownerNode) {
            originalDisabled[idx] = sheet.disabled;
            sheet.disabled = true; // Temporarily disable all stylesheets
          }
        } catch (e) {
          // Cross-origin stylesheets can't be disabled
        }
      });

      try {
        const canvas = await html2canvas(tempContainer, {
          backgroundColor: '#1e3a8a',
          scale: 3,
          logging: false,
          useCORS: true,
          allowTaint: false,
          width: 525,
          height: 330,
          windowWidth: 525,
          windowHeight: 330,
          foreignObjectRendering: true, // Use foreignObject to avoid stylesheet parsing
          ignoreElements: (element) => {
            return element.classList && element.classList.contains('animate-shine');
          },
          onclone: (clonedDoc) => {
            // Remove ALL style and link tags that might contain oklab
            const styleTags = clonedDoc.querySelectorAll('style');
            styleTags.forEach(style => style.remove());
            
            const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
            linkTags.forEach(link => link.remove());
            
            // Remove ALL classes and attributes that might reference stylesheets
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach(el => {
              try {
                // Remove all classes and class attribute
                el.className = '';
                el.removeAttribute('class');
                
                // Ensure element is visible with inline styles
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                if (!el.style.display || el.style.display === 'none') {
                  el.style.display = 'block';
                }
              } catch (e) {
                // Ignore errors
              }
            });
          },
        });
        
        // Re-enable stylesheets
        styleSheets.forEach((sheet, idx) => {
          try {
            if (sheet.ownerNode && originalDisabled[idx] !== undefined) {
              sheet.disabled = originalDisabled[idx];
            }
          } catch (e) {
            // Ignore
          }
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
      } catch (canvasError) {
        // Re-enable stylesheets even on error
        styleSheets.forEach((sheet, idx) => {
          try {
            if (sheet.ownerNode && originalDisabled[idx] !== undefined) {
              sheet.disabled = originalDisabled[idx];
            }
          } catch (e) {
            // Ignore
          }
        });
        throw canvasError;
      }

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

