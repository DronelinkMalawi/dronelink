/**
 * Image Compression Utility
 * Compresses images client-side before upload to save storage space
 * Uses Canvas API to resize and compress images
 */

export interface CompressionOptions {
  /** Maximum width in pixels (default: 1920) */
  maxWidth?: number;
  /** Maximum height in pixels (default: 1920) */
  maxHeight?: number;
  /** JPEG/WebP quality (0-1, default: 0.8) */
  quality?: number;
  /** Output format: 'webp' | 'jpeg' | 'png' (default: 'webp') */
  format?: 'webp' | 'jpeg' | 'png';
  /** Whether to preserve EXIF orientation (default: true) */
  preserveOrientation?: boolean;
}

export interface CompressionResult {
  /** The compressed file */
  file: File;
  /** Original file size in bytes */
  originalSize: number;
  /** Compressed file size in bytes */
  compressedSize: number;
  /** Percentage saved (0-100) */
  savingsPercent: number;
  /** Original dimensions */
  originalWidth: number;
  /** Original height */
  originalHeight: number;
  /** Compressed dimensions */
  compressedWidth: number;
  /** Compressed height */
  compressedHeight: number;
  /** Whether compression was applied */
  wasCompressed: boolean;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  format: 'webp',
  preserveOrientation: true
};

/**
 * Load an image from a File object
 */
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

/**
 * Read EXIF orientation from an image file
 */
const getImageOrientation = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const view = new DataView(e.target?.result as ArrayBuffer);
      
      if (view.byteLength < 2 || view.getUint16(0, false) !== 0xFFD8) {
        // Not a JPEG, no EXIF
        resolve(1);
        return;
      }
      
      let offset = 2;
      while (offset < view.byteLength) {
        if (view.getUint16(offset, false) !== 0xFFE1) {
          offset += 2;
          continue;
        }
        
        const length = view.getUint16(offset + 2, false);
        if (length < 8) {
          offset += 2 + length;
          continue;
        }
        
        // Check for "Exif" marker
        if (view.getUint32(offset + 4, false) !== 0x45786966) {
          offset += 2 + length;
          continue;
        }
        
        // Check TIFF header
        const tiffOffset = offset + 10;
        const isLittleEndian = view.getUint16(tiffOffset, false) === 0x4949;
        
        // Find IFD0
        const ifdOffset = tiffOffset + view.getUint32(tiffOffset + 4, isLittleEndian);
        const entryCount = view.getUint16(ifdOffset, isLittleEndian);
        
        for (let i = 0; i < entryCount; i++) {
          const entry = ifdOffset + 2 + (i * 12);
          const tag = view.getUint16(entry, isLittleEndian);
          
          if (tag === 0x0112) { // Orientation tag
            const orientation = view.getUint16(entry + 8, isLittleEndian);
            resolve(orientation);
            return;
          }
        }
        
        break;
      }
      
      resolve(1);
    };
    
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Apply EXIF orientation to canvas
 */
const applyOrientation = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  orientation: number,
  width: number,
  height: number
) => {
  switch (orientation) {
    case 2: // Flip horizontal
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3: // Rotate 180
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4: // Flip vertical
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5: // Transpose
      ctx.translate(height, 0);
      ctx.rotate(Math.PI / 2);
      ctx.scale(-1, 1);
      break;
    case 6: // Rotate 90
      ctx.translate(height, 0);
      ctx.rotate(Math.PI / 2);
      break;
    case 7: // Transverse
      ctx.translate(0, width);
      ctx.rotate(-Math.PI / 2);
      ctx.scale(-1, 1);
      break;
    case 8: // Rotate 270
      ctx.translate(0, width);
      ctx.rotate(-Math.PI / 2);
      break;
    default:
      break;
  }
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
const calculateDimensions = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let newWidth = width;
  let newHeight = height;
  
  // Scale down if too wide
  if (newWidth > maxWidth) {
    const ratio = maxWidth / newWidth;
    newWidth = maxWidth;
    newHeight = Math.round(newHeight * ratio);
  }
  
  // Scale down if too tall
  if (newHeight > maxHeight) {
    const ratio = maxHeight / newHeight;
    newHeight = maxHeight;
    newWidth = Math.round(newWidth * ratio);
  }
  
  return { width: newWidth, height: newHeight };
};

/**
 * Compress an image file
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Only compress image files
  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      savingsPercent: 0,
      originalWidth: 0,
      originalHeight: 0,
      compressedWidth: 0,
      compressedHeight: 0,
      wasCompressed: false
    };
  }
  
  try {
    // Load the image
    const img = await loadImage(file);
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;
    
    // Get orientation
    let orientation = 1;
    if (opts.preserveOrientation) {
      orientation = await getImageOrientation(file);
    }
    
    // Calculate new dimensions
    const { width: newWidth, height: newHeight } = calculateDimensions(
      originalWidth,
      originalHeight,
      opts.maxWidth!,
      opts.maxHeight!
    );
    
    // Check if compression is needed
    const needsResize = newWidth < originalWidth || newHeight < originalHeight;
    const needsCompression = file.size > 100 * 1024; // > 100KB
    
    if (!needsResize && !needsCompression) {
      return {
        file,
        originalSize: file.size,
        compressedSize: file.size,
        savingsPercent: 0,
        originalWidth,
        originalHeight,
        compressedWidth: originalWidth,
        compressedHeight: originalHeight,
        wasCompressed: false
      };
    }
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    // Apply white background for JPEG (to avoid transparency issues)
    if (opts.format === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, newWidth, newHeight);
    }
    
    // Apply orientation
    if (orientation > 1) {
      ctx.save();
      applyOrientation(ctx, img, orientation, newWidth, newHeight);
    }
    
    // Draw the image
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
    if (orientation > 1) {
      ctx.restore();
    }
    
    // Convert to blob
    const mimeType = opts.format === 'webp' 
      ? 'image/webp' 
      : opts.format === 'jpeg' 
        ? 'image/jpeg' 
        : 'image/png';
    
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        mimeType,
        opts.quality
      );
    });
    
    // Create new file
    const extension = opts.format === 'webp' ? 'webp' : opts.format === 'jpeg' ? 'jpg' : 'png';
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const compressedFile = new File([blob], `${baseName}.${extension}`, {
      type: mimeType,
      lastModified: Date.now()
    });
    
    const savingsPercent = file.size > 0 
      ? Math.round(((file.size - blob.size) / file.size) * 100) 
      : 0;
    
    return {
      file: compressedFile,
      originalSize: file.size,
      compressedSize: blob.size,
      savingsPercent: Math.max(0, savingsPercent),
      originalWidth,
      originalHeight,
      compressedWidth: newWidth,
      compressedHeight: newHeight,
      wasCompressed: true
    };
  } catch (error) {
    console.error('Image compression failed, using original:', error);
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      savingsPercent: 0,
      originalWidth: 0,
      originalHeight: 0,
      compressedWidth: 0,
      compressedHeight: 0,
      wasCompressed: false
    };
  }
};

/**
 * Compress multiple image files
 */
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressionResult[]> => {
  const results: CompressionResult[] = [];
  
  for (const file of files) {
    const result = await compressImage(file, options);
    results.push(result);
  }
  
  return results;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get a human-readable compression summary
 */
export const getCompressionSummary = (results: CompressionResult[]): string => {
  if (results.length === 0) return '';
  
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalSavings = totalOriginal - totalCompressed;
  const savingsPercent = totalOriginal > 0 
    ? Math.round((totalSavings / totalOriginal) * 100) 
    : 0;
  
  return `${formatFileSize(totalOriginal)} → ${formatFileSize(totalCompressed)} (${savingsPercent}% saved)`;
};