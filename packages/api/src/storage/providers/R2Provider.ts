import { S3Provider } from "./S3Provider";
import type { S3Config } from "./S3Provider";

export interface R2Config {
	accountId: string;
	accessKeyId: string;
	secretAccessKey: string;
	bucket: string;
}

/**
 * Cloudflare R2 Storage Provider
 * R2 is S3-compatible, so we extend S3Provider with R2-specific endpoint
 */
export class R2Provider extends S3Provider {
	readonly name = "r2";

	constructor(config: R2Config) {
		// R2 endpoint format: https://<account_id>.r2.cloudflarestorage.com
		const r2Endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;

		const s3Config: S3Config = {
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
			region: "auto", // R2 uses "auto" as the region
			bucket: config.bucket,
			endpoint: r2Endpoint,
		};

		super(s3Config);
	}

	/**
	 * Get public URL for R2
	 * R2 can have custom domains, but for now we use the default R2.dev domain
	 */
	getPublicUrl(accountId: string, bucket: string, key: string): string {
		return `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${key}`;
	}
}
