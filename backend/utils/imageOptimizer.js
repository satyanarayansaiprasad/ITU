const sharp = require('sharp');

/**
 * Optimizes an image buffer before upload
 * @param {Buffer} buffer - Original image buffer
 * @param {Object} options - Optimization options
 * @returns {Promise<Buffer>} - Optimized image buffer
 */
const optimizeImage = async (buffer, options = {}) => {
  try {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 50,
      format = 'avif'
    } = options;

    let pipeline = sharp(buffer);
    const metadata = await pipeline.metadata();

    // Resize if larger than max dimensions while maintaining aspect ratio
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      pipeline = pipeline.resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convert to requested format and apply quality compression
    if (format === 'avif') {
      pipeline = pipeline.avif({ quality, effort: 4 });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'jpeg' || format === 'jpg') {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    } else if (format === 'png') {
      pipeline = pipeline.png({ compressionLevel: 9, quality });
    }

    return await pipeline.toBuffer();
  } catch (error) {
    console.error('Image optimization error:', error);
    // If optimization fails, return original buffer as fallback
    return buffer;
  }
};

module.exports = {
  optimizeImage
};
