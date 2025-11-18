import { db } from "@fotomono/db";
import { storageConfig } from "@fotomono/db/schema/storage";
import { eq } from "drizzle-orm";
import { decrypt } from "../utils/encryption";
import type { IStorageProvider } from "./IStorageProvider";
import {
  type GoogleDriveConfig,
  GoogleDriveProvider,
} from "./providers/GoogleDriveProvider";
import { type NASConfig, NASProvider } from "./providers/NASProvider";
import { type R2Config, R2Provider } from "./providers/R2Provider";
import { type S3Config, S3Provider } from "./providers/S3Provider";

export type ProviderType = "s3" | "r2" | "google-drive" | "nas";

export interface StorageConfigData {
  id: string;
  userId: string;
  providerType: ProviderType;
  providerName: string | null;
  credentialsEncrypted: string;
  bucketName: string | null;
  region: string | null;
  folderPath: string | null;
  publicUrl: string | null;
  isActive: boolean;
  isDefault: boolean;
}

/**
 * Storage Factory
 * Creates the appropriate storage provider based on configuration
 */
export class StorageFactory {
  /**
   * Create a storage provider from database configuration
   */
  static async createFromConfig(
    configId: string,
    userId: string
  ): Promise<IStorageProvider> {
    // Fetch configuration from database
    const config = await db
      .select()
      .from(storageConfig)
      .where(eq(storageConfig.id, configId))
      .limit(1);

    if (!config || config.length === 0) {
      throw new Error("Storage configuration not found");
    }

    const storageConfigData = config[0];

    // Verify user owns this config
    if (storageConfigData.userId !== userId) {
      throw new Error("Unauthorized access to storage configuration");
    }

    if (!storageConfigData.isActive) {
      throw new Error("Storage configuration is not active");
    }

    // Decrypt credentials
    const credentials = JSON.parse(
      decrypt(storageConfigData.credentialsEncrypted)
    );

    return StorageFactory.createProvider(
      storageConfigData.providerType as ProviderType,
      credentials,
      storageConfigData
    );
  }

  /**
   * Create a storage provider for the user's default configuration
   */
  static async createDefaultForUser(userId: string): Promise<IStorageProvider> {
    // Fetch default configuration
    const config = await db
      .select()
      .from(storageConfig)
      .where(eq(storageConfig.userId, userId))
      .limit(1);

    if (!config || config.length === 0) {
      throw new Error("No storage configuration found for user");
    }

    const defaultConfig = config.find((c) => c.isDefault) || config[0];

    if (!defaultConfig) {
      throw new Error("No default storage configuration found");
    }

    // Decrypt credentials
    const credentials = JSON.parse(decrypt(defaultConfig.credentialsEncrypted));

    return StorageFactory.createProvider(
      defaultConfig.providerType as ProviderType,
      credentials,
      defaultConfig
    );
  }

  /**
   * Create a storage provider directly from credentials
   */
  static createProvider(
    providerType: ProviderType,
    credentials: unknown,
    config?: Partial<StorageConfigData>
  ): IStorageProvider {
    switch (providerType) {
      case "s3":
        return new S3Provider({
          ...((credentials as S3Config) || {}),
          bucket: config?.bucketName || (credentials as S3Config).bucket,
          region: config?.region || (credentials as S3Config).region,
        });

      case "r2":
        return new R2Provider({
          ...((credentials as R2Config) || {}),
          bucket: config?.bucketName || (credentials as R2Config).bucket,
        });

      case "google-drive":
        return new GoogleDriveProvider({
          ...((credentials as GoogleDriveConfig) || {}),
          folderId: config?.folderPath,
        });

      case "nas":
        return new NASProvider({
          ...((credentials as NASConfig) || {}),
          basePath: config?.folderPath,
        });

      default:
        throw new Error(`Unsupported storage provider: ${providerType}`);
    }
  }

  /**
   * Test connection for a provider configuration
   */
  static async testConnection(
    providerType: ProviderType,
    credentials: unknown,
    config?: Partial<StorageConfigData>
  ): Promise<boolean> {
    try {
      const provider = StorageFactory.createProvider(
        providerType,
        credentials,
        config
      );
      return await provider.testConnection();
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }
}
