import { db } from "@fotomono/db";
import { image } from "@fotomono/db/schema/images";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { StorageFactory } from "../storage/StorageFactory";
import { imageProcessor } from "./imageProcessing";

/**
 * Allowed image MIME types
 */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

/**
 * Maximum file size: 50MB
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export interface UploadImageOptions {
  userId: string;
  showId: string;
  file: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    size: number;
  };
  storageConfigId?: string; // Optional: use specific storage config
  tags?: string[];
  category?: string;
}

export interface UploadImageResult {
  imageId: string;
  url: string;
  thumbnails: {
    small: string;
    medium: string;
    large: string;
  };
}

/**
 * Image Service
 * Handles image validation, processing, and upload workflow
 */
export class ImageService {
  /**
   * Validate image file
   */
  validateImage(file: { mimeType: string; size: number; buffer: Buffer }): {
    valid: boolean;
    error?: string;
  } {
    // Check MIME type
    if (
      !ALLOWED_MIME_TYPES.includes(
        file.mimeType as (typeof ALLOWED_MIME_TYPES)[number]
      )
    ) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "File size exceeds maximum limit of 50MB",
      };
    }

    // Validate buffer
    if (!Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
      return {
        valid: false,
        error: "Invalid file buffer",
      };
    }

    return { valid: true };
  }

  /**
   * Upload image workflow
   * 1. Validate image
   * 2. Extract EXIF data
   * 3. Process image (optimize + generate thumbnails)
   * 4. Upload to storage provider
   * 5. Save metadata to database
   */
  async uploadImage(options: UploadImageOptions): Promise<UploadImageResult> {
    // Step 1: Validate image
    const validation = this.validateImage(options.file);
    if (!validation.valid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: validation.error || "Invalid image file",
      });
    }

    // Step 2: Extract EXIF data
    const exifData = await imageProcessor.extractExif(options.file.buffer);

    // Step 3: Process image (optimize + thumbnails)
    const processed = await imageProcessor.processImage(options.file.buffer, {
      format: "jpeg",
      quality: 85,
    });

    // Step 4: Get storage provider
    const storageProvider = options.storageConfigId
      ? await StorageFactory.createFromConfig(
          options.storageConfigId,
          options.userId
        )
      : await StorageFactory.createDefaultForUser(options.userId);

    // Upload original image
    const originalUpload = await storageProvider.upload({
      buffer: processed.original,
      filename: `${nanoid()}_${options.file.filename}`,
      mimeType: "image/jpeg",
      path: `shows/${options.showId}/originals`,
      metadata: {
        showId: options.showId,
        userId: options.userId,
        type: "original",
      },
    });

    // Upload thumbnails
    const [smallUpload, mediumUpload, largeUpload] = await Promise.all([
      storageProvider.upload({
        buffer: processed.thumbnails.small,
        filename: `thumb_small_${nanoid()}.jpg`,
        mimeType: "image/jpeg",
        path: `shows/${options.showId}/thumbnails/small`,
        metadata: { type: "thumbnail", size: "small" },
      }),
      storageProvider.upload({
        buffer: processed.thumbnails.medium,
        filename: `thumb_medium_${nanoid()}.jpg`,
        mimeType: "image/jpeg",
        path: `shows/${options.showId}/thumbnails/medium`,
        metadata: { type: "thumbnail", size: "medium" },
      }),
      storageProvider.upload({
        buffer: processed.thumbnails.large,
        filename: `thumb_large_${nanoid()}.jpg`,
        mimeType: "image/jpeg",
        path: `shows/${options.showId}/thumbnails/large`,
        metadata: { type: "thumbnail", size: "large" },
      }),
    ]);

    // Step 5: Save metadata to database
    const imageId = nanoid();
    await db.insert(image).values({
      id: imageId,
      showId: options.showId,
      userId: options.userId,
      filename: options.file.filename,
      originalUrl: originalUpload.url,
      thumbnailSmallUrl: smallUpload.url,
      thumbnailMediumUrl: mediumUpload.url,
      thumbnailLargeUrl: largeUpload.url,
      fileSize: processed.metadata.size,
      width: processed.metadata.width,
      height: processed.metadata.height,
      format: processed.metadata.format,
      exifData: exifData as Record<string, string | number | boolean>,
      storageProvider: storageProvider.name,
      storageFileId: originalUpload.fileId,
      tags: options.tags || null,
      category: options.category || null,
      isPortfolio: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      imageId,
      url: originalUpload.url,
      thumbnails: {
        small: smallUpload.url,
        medium: mediumUpload.url,
        large: largeUpload.url,
      },
    };
  }

  /**
   * Upload multiple images in batch
   */
  async uploadBatch(
    options: Omit<UploadImageOptions, "file"> & {
      files: UploadImageOptions["file"][];
    }
  ): Promise<UploadImageResult[]> {
    const results: UploadImageResult[] = [];

    for (const file of options.files) {
      try {
        const result = await this.uploadImage({
          ...options,
          file,
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.filename}:`, error);
        // Continue with next file
      }
    }

    return results;
  }
}

/**
 * Singleton instance
 */
export const imageService = new ImageService();
