import sharp from "sharp";

export interface ThumbnailSizes {
  small: number; // 300px
  medium: number; // 800px
  large: number; // 1920px
}

export interface ProcessedImage {
  original: Buffer;
  thumbnails: {
    small: Buffer;
    medium: Buffer;
    large: Buffer;
  };
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

/**
 * Default thumbnail sizes
 */
export const DEFAULT_THUMBNAIL_SIZES: ThumbnailSizes = {
  small: 300,
  medium: 800,
  large: 1920,
};

/**
 * Image Processing Service
 * Handles image optimization and thumbnail generation using Sharp
 */
export class ImageProcessingService {
  private thumbnailSizes: ThumbnailSizes;

  constructor(thumbnailSizes: ThumbnailSizes = DEFAULT_THUMBNAIL_SIZES) {
    this.thumbnailSizes = thumbnailSizes;
  }

  /**
   * Process an image: optimize and generate thumbnails
   */
  async processImage(
    buffer: Buffer,
    options: {
      quality?: number;
      format?: "jpeg" | "webp" | "png";
    } = {}
  ): Promise<ProcessedImage> {
    const quality = options.quality || 85;
    const format = options.format || "jpeg";

    // Get original image metadata
    const metadata = await sharp(buffer).metadata();

    // Optimize original image
    let originalProcessed = sharp(buffer);

    if (format === "jpeg") {
      originalProcessed = originalProcessed.jpeg({ quality, mozjpeg: true });
    } else if (format === "webp") {
      originalProcessed = originalProcessed.webp({ quality });
    } else if (format === "png") {
      originalProcessed = originalProcessed.png({
        quality,
        compressionLevel: 9,
      });
    }

    const optimizedOriginal = await originalProcessed.toBuffer();

    // Generate thumbnails
    const thumbnails = await this.generateThumbnails(buffer, format, quality);

    return {
      original: optimizedOriginal,
      thumbnails,
      metadata: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || "unknown",
        size: optimizedOriginal.length,
      },
    };
  }

  /**
   * Generate all thumbnail sizes
   */
  private async generateThumbnails(
    buffer: Buffer,
    format: "jpeg" | "webp" | "png",
    quality: number
  ): Promise<ProcessedImage["thumbnails"]> {
    const [small, medium, large] = await Promise.all([
      this.generateThumbnail(
        buffer,
        this.thumbnailSizes.small,
        format,
        quality
      ),
      this.generateThumbnail(
        buffer,
        this.thumbnailSizes.medium,
        format,
        quality
      ),
      this.generateThumbnail(
        buffer,
        this.thumbnailSizes.large,
        format,
        quality
      ),
    ]);

    return {
      small,
      medium,
      large,
    };
  }

  /**
   * Generate a single thumbnail
   */
  private async generateThumbnail(
    buffer: Buffer,
    size: number,
    format: "jpeg" | "webp" | "png",
    quality: number
  ): Promise<Buffer> {
    let thumbnail = sharp(buffer).resize(size, size, {
      fit: "inside",
      withoutEnlargement: true,
    });

    if (format === "jpeg") {
      thumbnail = thumbnail.jpeg({ quality, mozjpeg: true });
    } else if (format === "webp") {
      thumbnail = thumbnail.webp({ quality });
    } else if (format === "png") {
      thumbnail = thumbnail.png({ quality, compressionLevel: 9 });
    }

    return thumbnail.toBuffer();
  }

  /**
   * Extract EXIF data from image
   */
  async extractExif(buffer: Buffer): Promise<Record<string, unknown>> {
    const metadata = await sharp(buffer).metadata();

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation,
      exif: metadata.exif ? this.parseExifBuffer(metadata.exif) : {},
    };
  }

  /**
   * Parse EXIF buffer to readable object
   */
  private parseExifBuffer(exifBuffer: Buffer): Record<string, unknown> {
    try {
      // Basic EXIF parsing - in production, use a library like exif-parser
      // For now, return raw buffer info
      return {
        raw: exifBuffer.toString("base64").substring(0, 100) + "...",
        size: exifBuffer.length,
      };
    } catch (error) {
      console.error("EXIF parsing error:", error);
      return {};
    }
  }

  /**
   * Validate image dimensions
   */
  async validateDimensions(
    buffer: Buffer,
    minWidth?: number,
    minHeight?: number,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<{ valid: boolean; error?: string }> {
    const metadata = await sharp(buffer).metadata();

    if (!(metadata.width && metadata.height)) {
      return { valid: false, error: "Could not determine image dimensions" };
    }

    if (minWidth && metadata.width < minWidth) {
      return {
        valid: false,
        error: `Image width must be at least ${minWidth}px`,
      };
    }

    if (minHeight && metadata.height < minHeight) {
      return {
        valid: false,
        error: `Image height must be at least ${minHeight}px`,
      };
    }

    if (maxWidth && metadata.width > maxWidth) {
      return {
        valid: false,
        error: `Image width must not exceed ${maxWidth}px`,
      };
    }

    if (maxHeight && metadata.height > maxHeight) {
      return {
        valid: false,
        error: `Image height must not exceed ${maxHeight}px`,
      };
    }

    return { valid: true };
  }

  /**
   * Convert image to specific format
   */
  async convertFormat(
    buffer: Buffer,
    targetFormat: "jpeg" | "webp" | "png",
    quality = 85
  ): Promise<Buffer> {
    let converter = sharp(buffer);

    if (targetFormat === "jpeg") {
      converter = converter.jpeg({ quality, mozjpeg: true });
    } else if (targetFormat === "webp") {
      converter = converter.webp({ quality });
    } else if (targetFormat === "png") {
      converter = converter.png({ quality, compressionLevel: 9 });
    }

    return converter.toBuffer();
  }
}

/**
 * Singleton instance for convenience
 */
export const imageProcessor = new ImageProcessingService();
