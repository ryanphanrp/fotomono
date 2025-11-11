import { google, drive_v3 } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import type {
	IStorageProvider,
	UploadOptions,
	UploadResult,
	DownloadOptions,
	DownloadResult,
	DeleteOptions,
	ListOptions,
	ListResult,
} from "../IStorageProvider";
import { Readable } from "node:stream";

export interface GoogleDriveConfig {
	clientId: string;
	clientSecret: string;
	refreshToken: string;
	redirectUri?: string;
	folderId?: string; // Optional root folder for uploads
}

/**
 * Google Drive Storage Provider
 * Implements file upload/download/delete operations for Google Drive using OAuth2
 */
export class GoogleDriveProvider implements IStorageProvider {
	readonly name = "google-drive";
	private drive: drive_v3.Drive;
	private oauth2Client: OAuth2Client;
	private folderId?: string;

	constructor(config: GoogleDriveConfig) {
		this.folderId = config.folderId;

		// Initialize OAuth2 client
		this.oauth2Client = new google.auth.OAuth2(
			config.clientId,
			config.clientSecret,
			config.redirectUri || "http://localhost:3000/api/auth/google-drive/callback",
		);

		// Set refresh token
		this.oauth2Client.setCredentials({
			refresh_token: config.refreshToken,
		});

		// Initialize Drive API
		this.drive = google.drive({
			version: "v3",
			auth: this.oauth2Client,
		});
	}

	async upload(options: UploadOptions): Promise<UploadResult> {
		const parents = this.folderId ? [this.folderId] : undefined;

		// Convert buffer to readable stream
		const stream = Readable.from(options.buffer);

		const fileMetadata: drive_v3.Schema$File = {
			name: options.filename,
			parents,
			description: options.metadata
				? JSON.stringify(options.metadata)
				: undefined,
		};

		const media = {
			mimeType: options.mimeType,
			body: stream,
		};

		const response = await this.drive.files.create({
			requestBody: fileMetadata,
			media,
			fields: "id,name,size,webViewLink,webContentLink",
		});

		const file = response.data;

		if (!file.id) {
			throw new Error("Failed to upload file to Google Drive");
		}

		// Make file accessible via link
		await this.drive.permissions.create({
			fileId: file.id,
			requestBody: {
				role: "reader",
				type: "anyone",
			},
		});

		const url = file.webContentLink || file.webViewLink || "";

		return {
			fileId: file.id,
			url,
			size: Number.parseInt(file.size || "0", 10),
			metadata: {
				name: file.name,
				webViewLink: file.webViewLink,
				webContentLink: file.webContentLink,
			},
		};
	}

	async download(options: DownloadOptions): Promise<DownloadResult> {
		// Get file metadata first
		const fileMetadata = await this.drive.files.get({
			fileId: options.fileId,
			fields: "name,mimeType",
		});

		// Download file content
		const response = await this.drive.files.get(
			{
				fileId: options.fileId,
				alt: "media",
			},
			{ responseType: "arraybuffer" },
		);

		const buffer = Buffer.from(response.data as ArrayBuffer);

		return {
			buffer,
			filename: fileMetadata.data.name || "unknown",
			mimeType: fileMetadata.data.mimeType || "application/octet-stream",
		};
	}

	async delete(options: DeleteOptions): Promise<void> {
		await this.drive.files.delete({
			fileId: options.fileId,
		});
	}

	async list(options?: ListOptions): Promise<ListResult> {
		const query = this.folderId
			? `'${this.folderId}' in parents and trashed = false`
			: "trashed = false";

		const response = await this.drive.files.list({
			q: query,
			pageSize: options?.limit || 100,
			pageToken: options?.pageToken,
			fields:
				"nextPageToken, files(id, name, size, mimeType, createdTime, modifiedTime, webViewLink)",
		});

		const files =
			response.data.files?.map((file) => ({
				fileId: file.id || "",
				filename: file.name || "",
				size: Number.parseInt(file.size || "0", 10),
				mimeType: file.mimeType || "application/octet-stream",
				createdAt: file.createdTime ? new Date(file.createdTime) : new Date(),
				modifiedAt: file.modifiedTime
					? new Date(file.modifiedTime)
					: new Date(),
				url: file.webViewLink,
			})) || [];

		return {
			files,
			nextPageToken: response.data.nextPageToken || undefined,
		};
	}

	async getSignedUrl(
		fileId: string,
		_expiresInSeconds = 3600,
	): Promise<string> {
		// Google Drive doesn't use signed URLs in the same way
		// Get the file's webContentLink instead
		const response = await this.drive.files.get({
			fileId,
			fields: "webContentLink,webViewLink",
		});

		return (
			response.data.webContentLink ||
			response.data.webViewLink ||
			`https://drive.google.com/file/d/${fileId}/view`
		);
	}

	async testConnection(): Promise<boolean> {
		try {
			await this.drive.files.list({
				pageSize: 1,
			});
			return true;
		} catch (error) {
			console.error("Google Drive connection test failed:", error);
			return false;
		}
	}

	async getUsage(): Promise<{
		used: number;
		total: number;
		unit: "bytes" | "gb";
	}> {
		const response = await this.drive.about.get({
			fields: "storageQuota",
		});

		const quota = response.data.storageQuota;

		return {
			used: Number.parseInt(quota?.usage || "0", 10),
			total: Number.parseInt(quota?.limit || "0", 10),
			unit: "bytes",
		};
	}
}
