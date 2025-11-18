/**
 * Storage Provider Interface
 * Abstraction layer for multiple storage backends (Google Drive, S3, R2, NAS)
 */

export interface UploadOptions {
  /**
   * File buffer to upload
   */
  buffer: Buffer;

  /**
   * Original filename
   */
  filename: string;

  /**
   * MIME type of the file
   */
  mimeType: string;

  /**
   * Optional folder/path within the storage
   */
  path?: string;

  /**
   * Optional metadata to attach to the file
   */
  metadata?: Record<string, string>;
}

export interface UploadResult {
  /**
   * Unique identifier for the uploaded file
   */
  fileId: string;

  /**
   * Public or signed URL to access the file
   */
  url: string;

  /**
   * File size in bytes
   */
  size: number;

  /**
   * Additional provider-specific metadata
   */
  metadata?: Record<string, unknown>;
}

export interface DownloadOptions {
  /**
   * Unique identifier of the file to download
   */
  fileId: string;

  /**
   * Optional path if using path-based storage
   */
  path?: string;
}

export interface DownloadResult {
  /**
   * File content as buffer
   */
  buffer: Buffer;

  /**
   * Original filename
   */
  filename: string;

  /**
   * MIME type
   */
  mimeType: string;
}

export interface DeleteOptions {
  /**
   * Unique identifier of the file to delete
   */
  fileId: string;

  /**
   * Optional path if using path-based storage
   */
  path?: string;
}

export interface ListOptions {
  /**
   * Optional folder/path to list files from
   */
  path?: string;

  /**
   * Maximum number of files to return
   */
  limit?: number;

  /**
   * Pagination token
   */
  pageToken?: string;
}

export interface FileInfo {
  /**
   * Unique identifier
   */
  fileId: string;

  /**
   * Filename
   */
  filename: string;

  /**
   * File size in bytes
   */
  size: number;

  /**
   * MIME type
   */
  mimeType: string;

  /**
   * Created date
   */
  createdAt: Date;

  /**
   * Modified date
   */
  modifiedAt: Date;

  /**
   * Public or signed URL
   */
  url?: string;
}

export interface ListResult {
  /**
   * Array of files
   */
  files: FileInfo[];

  /**
   * Next page token for pagination
   */
  nextPageToken?: string;
}

/**
 * Storage Provider Interface
 * All storage providers must implement this interface
 */
export interface IStorageProvider {
  /**
   * Provider name (e.g., "google-drive", "s3", "r2", "nas")
   */
  readonly name: string;

  /**
   * Upload a file to storage
   */
  upload(options: UploadOptions): Promise<UploadResult>;

  /**
   * Download a file from storage
   */
  download(options: DownloadOptions): Promise<DownloadResult>;

  /**
   * Delete a file from storage
   */
  delete(options: DeleteOptions): Promise<void>;

  /**
   * List files in storage
   */
  list(options?: ListOptions): Promise<ListResult>;

  /**
   * Generate a signed URL for file access (with expiration)
   */
  getSignedUrl(fileId: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Test the connection and credentials
   */
  testConnection(): Promise<boolean>;

  /**
   * Get storage usage statistics
   */
  getUsage(): Promise<{
    used: number;
    total: number;
    unit: "bytes" | "gb";
  }>;
}
