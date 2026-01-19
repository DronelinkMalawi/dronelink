export interface WatermarkOptions {
  logoUrl?: string;
  text?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;
  scale?: number;
  margin?: number;
}

export class ImageWatermarker {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Apply watermark to an image file
   */
  async applyWatermark(
    imageFile: File,
    options: WatermarkOptions = {}
  ): Promise<Blob> {
    const {
      logoUrl = '/logo.png', // Default logo path
      text = '© DronelinkMW',
      position = 'bottom-right',
      opacity = 0.7,
      scale = 0.15,
      margin = 20
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          // Set canvas dimensions to match image
          this.canvas.width = img.width;
          this.canvas.height = img.height;

          // Draw the original image
          this.ctx.drawImage(img, 0, 0);

          // Apply watermark
          this.applyLogoWatermark(logoUrl, position, opacity, scale, margin);
          this.applyTextWatermark(text, position, opacity * 0.8, margin);

          // Convert canvas to blob
          this.canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create watermarked image'));
            }
          }, imageFile.type, 0.95);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      
      // Load the image from the file
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(imageFile);
    });
  }

  /**
   * Apply logo watermark
   */
  private applyLogoWatermark(
    logoUrl: string,
    position: string,
    opacity: number,
    scale: number,
    margin: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const logo = new Image();
      
      logo.onload = () => {
        try {
          const logoWidth = this.canvas.width * scale;
          const logoHeight = (logo.height / logo.width) * logoWidth;
          
          // Calculate position
          const { x, y } = this.calculatePosition(
            logoWidth,
            logoHeight,
            position,
            margin
          );

          // Set transparency and draw logo
          this.ctx.globalAlpha = opacity;
          this.ctx.drawImage(logo, x, y, logoWidth, logoHeight);
          this.ctx.globalAlpha = 1.0;
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      logo.onerror = () => {
        console.warn('Logo not found, skipping logo watermark');
        resolve(); // Continue without logo
      };
      
      logo.crossOrigin = 'anonymous';
      logo.src = logoUrl;
    });
  }

  /**
   * Apply text watermark
   */
  private applyTextWatermark(
    text: string,
    position: string,
    opacity: number,
    margin: number
  ): void {
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'bottom';

    // Measure text dimensions
    const textMetrics = this.ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 20;

    // Calculate text position (below logo or at specified position)
    const { x, y } = this.calculatePositionForText(
      textWidth,
      textHeight,
      position,
      margin
    );

    // Draw text with stroke for better visibility
    this.ctx.strokeText(text, x, y);
    this.ctx.fillText(text, x, y);
    this.ctx.globalAlpha = 1.0;
  }

  /**
   * Calculate position for watermark placement
   */
  private calculatePosition(
    width: number,
    height: number,
    position: string,
    margin: number
  ): { x: number; y: number } {
    switch (position) {
      case 'top-left':
        return { x: margin, y: margin };
      case 'top-right':
        return { x: this.canvas.width - width - margin, y: margin };
      case 'bottom-left':
        return { x: margin, y: this.canvas.height - height - margin };
      case 'bottom-right':
        return { 
          x: this.canvas.width - width - margin, 
          y: this.canvas.height - height - margin 
        };
      case 'center':
        return { 
          x: (this.canvas.width - width) / 2, 
          y: (this.canvas.height - height) / 2 
        };
      default:
        return { 
          x: this.canvas.width - width - margin, 
          y: this.canvas.height - height - margin 
        };
    }
  }

  /**
   * Calculate position specifically for text (below logo)
   */
  private calculatePositionForText(
    width: number,
    height: number,
    position: string,
    margin: number
  ): { x: number; y: number } {
    const textMargin = margin + 40; // Extra margin for text below logo
    
    switch (position) {
      case 'top-left':
        return { x: margin, y: margin + 40 };
      case 'top-right':
        return { x: this.canvas.width - width - margin, y: margin + 40 };
      case 'bottom-left':
        return { x: margin, y: this.canvas.height - margin };
      case 'bottom-right':
        return { x: this.canvas.width - width - margin, y: this.canvas.height - margin };
      case 'center':
        return { 
          x: (this.canvas.width - width) / 2, 
          y: (this.canvas.height - height) / 2 + 40 
        };
      default:
        return { x: margin, y: this.canvas.height - margin };
    }
  }

  /**
   * Create a watermark preview
   */
  async createPreview(
    imageFile: File,
    options?: WatermarkOptions
  ): Promise<string> {
    const blob = await this.applyWatermark(imageFile, options);
    return URL.createObjectURL(blob);
  }
}

// Singleton instance
export const imageWatermarker = new ImageWatermarker();

// Utility function for quick watermarking
export async function watermarkImage(
  imageFile: File,
  options?: WatermarkOptions
): Promise<File> {
  const watermarkedBlob = await imageWatermarker.applyWatermark(imageFile, options);
  
  return new File(
    [watermarkedBlob],
    imageFile.name.replace(/\.[^/.]+$/, '') + '_watermarked.' + 
    imageFile.name.split('.').pop(),
    { type: imageFile.type }
  );
}