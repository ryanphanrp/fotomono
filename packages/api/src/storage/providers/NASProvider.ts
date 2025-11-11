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

export interface NASConfig {
	endpoint: string; // HTTP endpoint for the NAS
	apiKey?: string; // Optional API key for authentication
	basePath?: string; // Base path on the NAS
}

/**
 * NAS Storage Provider (Basic Scaffolding)
 * Implements HTTP-based file operations for Network Attached Storage
 * This is a basic implementation that can be extended based on specific NAS requirements
 */
export class NASProvider implements IStorageProvider {
	readonly name = "nas";
	private endpoint: string;
	private apiKey?: string;
	private basePath: string;

	constructor(config: NASConfig) {
		this.endpoint = config.endpoint.replace(/\/$/, ""); // Remove trailing slash
		this.apiKey = config.apiKey;
		this.basePath = config.basePath || "/";
	}

	private getHeaders(): HeadersInit {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		if (this.apiKey) {
			headers.Authorization = `Bearer ${this.apiKey}`;
		}

		return headers;
	}

	async upload(options: UploadOptions): Promise<UploadResult> {
		const path = options.path
			? `${this.basePath}/${options.path}/${options.filename}`
			: `${this.basePath}/${options.filename}`;

		const formData = new FormData();
		const blob = new Blob([options.buffer], { type: options.mimeType });
		formData.append("file", blob, options.filename);
		formData.append("path", path);

		if (options.metadata) {
			formData.append("metadata", JSON.stringify(options.metadata));
		}

		const response = await fetch(`${this.endpoint}/upload`, {
			method: "POST",
			headers: this.apiKey
				? { Authorization: `Bearer ${this.apiKey}` }
				: undefined,
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`NAS upload failed: ${response.statusText}`);
		}

		const result = await response.json();

		return {
			fileId: result.fileId || path,
			url: result.url || `${this.endpoint}/files/${path}`,
			size: options.buffer.length,
			metadata: result.metadata,
		};
	}

	async download(options: DownloadOptions): Promise<DownloadResult> {
		const path = options.path
			? `${this.basePath}/${options.path}/${options.fileId}`
			: `${this.basePath}/${options.fileId}`;

		const response = await fetch(`${this.endpoint}/download?path=${encodeURIComponent(path)}`, {
			method: "GET",
			headers: this.getHeaders(),
		});

		if (!response.ok) {
			throw new Error(`NAS download failed: ${response.statusText}`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const filename = options.fileId.split("/").pop() || "unknown";
		const mimeType = response.headers.get("content-type") || "application/octet-stream";

		return {
			buffer,
			filename,
			mimeType,
		};
	}

	async delete(options: DeleteOptions): Promise<void> {
		const path = options.path
			? `${this.basePath}/${options.path}/${options.fileId}`
			: `${this.basePath}/${options.fileId}`;

		const response = await fetch(`${this.endpoint}/delete`, {
			method: "DELETE",
			headers: this.getHeaders(),
			body: JSON.stringify({ path }),
		});

		if (!response.ok) {
			throw new Error(`NAS delete failed: ${response.statusText}`);
		}
	}

	async list(options?: ListOptions): Promise<ListResult> {
		const path = options?.path
			? `${this.basePath}/${options.path}`
			: this.basePath;

		const params = new URLSearchParams({
			path,
			...(options?.limit && { limit: options.limit.toString() }),
			...(options?.pageToken && { pageToken: options.pageToken }),
		});

		const response = await fetch(`${this.endpoint}/list?${params.toString()}`, {
			method: "GET",
			headers: this.getHeaders(),
		});

		if (!response.ok) {
			throw new Error(`NAS list failed: ${response.statusText}`);
		}

		const result = await response.json();

		return {
			files:
				result.files?.map((file: unknown) => ({
					fileId: (file as { id: string }).id || "",
					filename: (file as { name: string }).name || "",
					size: (file as { size: number }).size || 0,
					mimeType:
						(file as { mimeType: string }).mimeType ||
						"application/octet-stream",
					createdAt: new Date(
						(file as { createdAt: string }).createdAt || Date.now(),
					),
					modifiedAt: new Date(
						(file as { modifiedAt: string }).modifiedAt || Date.now(),
					),
					url: (file as { url?: string }).url,
				})) || [],
			nextPageToken: result.nextPageToken,
		};
	}

	async getSignedUrl(
		fileId: string,
		_expiresInSeconds = 3600,
	): Promise<string> {
		// For NAS, return a direct URL (or implement token-based access if needed)
		const path = `${this.basePath}/${fileId}`;
		return `${this.endpoint}/files/${path}`;
	}

	async testConnection(): Promise<boolean> {
		try {
			const response = await fetch(`${this.endpoint}/health`, {
				method: "GET",
				headers: this.getHeaders(),
			});
			return response.ok;
		} catch (error) {
			console.error("NAS connection test failed:", error);
			return false;
		}
	}

	async getUsage(): Promise<{
		used: number;
		total: number;
		unit: "bytes" | "gb";
	}> {
		try {
			const response = await fetch(`${this.endpoint}/usage`, {
				method: "GET",
				headers: this.getHeaders(),
			});

			if (!response.ok) {
				throw new Error("Failed to get usage stats");
			}

			const result = await response.json();

			return {
				used: result.used || 0,
				total: result.total || 0,
				unit: result.unit || "bytes",
			};
		} catch (error) {
			console.error("Failed to get NAS usage:", error);
			return {
				used: 0,
				total: 0,
				unit: "bytes",
			};
		}
	}
}
