import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  DeleteOptions,
  DownloadOptions,
  DownloadResult,
  IStorageProvider,
  ListOptions,
  ListResult,
  UploadOptions,
  UploadResult,
} from "../IStorageProvider";

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string; // Optional custom endpoint
}

/**
 * AWS S3 Storage Provider
 * Implements file upload/download/delete operations for AWS S3
 */
export class S3Provider implements IStorageProvider {
  readonly name = "s3";
  private client: S3Client;
  private bucket: string;

  constructor(config: S3Config) {
    this.bucket = config.bucket;
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      ...(config.endpoint && { endpoint: config.endpoint }),
    });
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    const key = options.path
      ? `${options.path}/${options.filename}`
      : options.filename;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: options.buffer,
      ContentType: options.mimeType,
      Metadata: options.metadata,
    });

    await this.client.send(command);

    const url = await this.getSignedUrl(key);

    return {
      fileId: key,
      url,
      size: options.buffer.length,
      metadata: {
        bucket: this.bucket,
        key,
      },
    };
  }

  async download(options: DownloadOptions): Promise<DownloadResult> {
    const key = options.path
      ? `${options.path}/${options.fileId}`
      : options.fileId;

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.client.send(command);

    if (!response.Body) {
      throw new Error("File not found or empty");
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    // @ts-expect-error - Body is a readable stream
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return {
      buffer,
      filename: key.split("/").pop() || key,
      mimeType: response.ContentType || "application/octet-stream",
    };
  }

  async delete(options: DeleteOptions): Promise<void> {
    const key = options.path
      ? `${options.path}/${options.fileId}`
      : options.fileId;

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  async list(options?: ListOptions): Promise<ListResult> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: options?.path,
      MaxKeys: options?.limit || 100,
      ContinuationToken: options?.pageToken,
    });

    const response = await this.client.send(command);

    const files =
      response.Contents?.map((item) => ({
        fileId: item.Key || "",
        filename: item.Key?.split("/").pop() || "",
        size: item.Size || 0,
        mimeType: "application/octet-stream",
        createdAt: item.LastModified || new Date(),
        modifiedAt: item.LastModified || new Date(),
      })) || [];

    return {
      files,
      nextPageToken: response.NextContinuationToken,
    };
  }

  async getSignedUrl(fileId: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileId,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const command = new HeadBucketCommand({
        Bucket: this.bucket,
      });
      await this.client.send(command);
      return true;
    } catch (error) {
      console.error("S3 connection test failed:", error);
      return false;
    }
  }

  async getUsage(): Promise<{
    used: number;
    total: number;
    unit: "bytes" | "gb";
  }> {
    // S3 doesn't have a direct API for bucket size
    // This would require listing all objects and summing sizes
    // For now, return a placeholder
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
    });

    const response = await this.client.send(command);
    const used =
      response.Contents?.reduce((sum, item) => sum + (item.Size || 0), 0) || 0;

    return {
      used,
      total: -1, // S3 has no storage limit
      unit: "bytes",
    };
  }
}
