/**
 * Application-wide constants
 */

// API
export const API_VERSION = "v1" as const;
export const API_TIMEOUT = 30_000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

// Date formats
export const DATE_FORMAT = "yyyy-MM-dd" as const;
export const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss" as const;
