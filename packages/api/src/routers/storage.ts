import { db } from "@fotomono/db";
import { storageConfig } from "@fotomono/db/schema/storage";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { protectedProcedure, router } from "../index";
import {
  deleteStorageConfigSchema,
  getStorageConfigSchema,
  setStorageConfigSchema,
  testStorageConnectionSchema,
  updateStorageConfigSchema,
} from "../schemas/storage";
import { StorageFactory } from "../storage/StorageFactory";
import { encrypt } from "../utils/encryption";

/**
 * Storage router
 * Handles storage configuration and provider management
 */
export const storageRouter = router({
  /**
   * Set storage configuration
   * Creates or updates storage provider configuration
   */
  setConfig: protectedProcedure
    .input(setStorageConfigSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        // Encrypt credentials
        const credentialsEncrypted = encrypt(JSON.stringify(input.credentials));

        // If this is set as default, unset other defaults
        if (input.isDefault) {
          await db
            .update(storageConfig)
            .set({ isDefault: false })
            .where(eq(storageConfig.userId, userId));
        }

        // Create new storage configuration
        const newConfig = await db
          .insert(storageConfig)
          .values({
            id: nanoid(),
            userId,
            providerType: input.providerType,
            providerName: input.providerName || null,
            credentialsEncrypted,
            bucketName: input.bucketName || null,
            region: input.region || null,
            folderPath: input.folderPath || null,
            publicUrl: input.publicUrl || null,
            isActive: true,
            isDefault: input.isDefault,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return {
          success: true,
          message: "Storage configuration saved successfully",
          config: {
            id: newConfig[0].id,
            providerType: newConfig[0].providerType,
            providerName: newConfig[0].providerName,
            bucketName: newConfig[0].bucketName,
            region: newConfig[0].region,
            isDefault: newConfig[0].isDefault,
            isActive: newConfig[0].isActive,
          },
        };
      } catch (error) {
        console.error("Set storage config error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save storage configuration",
        });
      }
    }),

  /**
   * Get all storage configurations for user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;

      const configs = await db
        .select({
          id: storageConfig.id,
          providerType: storageConfig.providerType,
          providerName: storageConfig.providerName,
          bucketName: storageConfig.bucketName,
          region: storageConfig.region,
          folderPath: storageConfig.folderPath,
          publicUrl: storageConfig.publicUrl,
          isActive: storageConfig.isActive,
          isDefault: storageConfig.isDefault,
          totalStorageUsed: storageConfig.totalStorageUsed,
          totalFilesCount: storageConfig.totalFilesCount,
          lastTestedAt: storageConfig.lastTestedAt,
          lastTestSuccess: storageConfig.lastTestSuccess,
          createdAt: storageConfig.createdAt,
        })
        .from(storageConfig)
        .where(eq(storageConfig.userId, userId));

      return {
        configs,
      };
    } catch (error) {
      console.error("List storage configs error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch storage configurations",
      });
    }
  }),

  /**
   * Get storage configuration by ID
   */
  getById: protectedProcedure
    .input(getStorageConfigSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const config = await db
          .select({
            id: storageConfig.id,
            providerType: storageConfig.providerType,
            providerName: storageConfig.providerName,
            bucketName: storageConfig.bucketName,
            region: storageConfig.region,
            folderPath: storageConfig.folderPath,
            publicUrl: storageConfig.publicUrl,
            isActive: storageConfig.isActive,
            isDefault: storageConfig.isDefault,
            totalStorageUsed: storageConfig.totalStorageUsed,
            totalFilesCount: storageConfig.totalFilesCount,
            lastTestedAt: storageConfig.lastTestedAt,
            lastTestSuccess: storageConfig.lastTestSuccess,
          })
          .from(storageConfig)
          .where(
            and(
              eq(storageConfig.id, input.id),
              eq(storageConfig.userId, userId)
            )
          )
          .limit(1);

        if (!config || config.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Storage configuration not found",
          });
        }

        return config[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error("Get storage config error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch storage configuration",
        });
      }
    }),

  /**
   * Update storage configuration
   */
  update: protectedProcedure
    .input(updateStorageConfigSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        // Check if config exists and belongs to user
        const existing = await db
          .select()
          .from(storageConfig)
          .where(
            and(
              eq(storageConfig.id, input.id),
              eq(storageConfig.userId, userId)
            )
          )
          .limit(1);

        if (!existing || existing.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Storage configuration not found",
          });
        }

        // If setting as default, unset other defaults
        if (input.isDefault) {
          await db
            .update(storageConfig)
            .set({ isDefault: false })
            .where(eq(storageConfig.userId, userId));
        }

        // Update configuration
        const updated = await db
          .update(storageConfig)
          .set({
            ...(input.providerName !== undefined && {
              providerName: input.providerName,
            }),
            ...(input.isDefault !== undefined && {
              isDefault: input.isDefault,
            }),
            ...(input.isActive !== undefined && { isActive: input.isActive }),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(storageConfig.id, input.id),
              eq(storageConfig.userId, userId)
            )
          )
          .returning();

        return {
          success: true,
          message: "Storage configuration updated successfully",
          config: updated[0],
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error("Update storage config error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update storage configuration",
        });
      }
    }),

  /**
   * Delete storage configuration
   */
  delete: protectedProcedure
    .input(deleteStorageConfigSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        // Check if config exists and belongs to user
        const existing = await db
          .select()
          .from(storageConfig)
          .where(
            and(
              eq(storageConfig.id, input.id),
              eq(storageConfig.userId, userId)
            )
          )
          .limit(1);

        if (!existing || existing.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Storage configuration not found",
          });
        }

        // Delete configuration
        await db
          .delete(storageConfig)
          .where(
            and(
              eq(storageConfig.id, input.id),
              eq(storageConfig.userId, userId)
            )
          );

        return {
          success: true,
          message: "Storage configuration deleted successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error("Delete storage config error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete storage configuration",
        });
      }
    }),

  /**
   * Test storage connection
   */
  testConnection: protectedProcedure
    .input(testStorageConnectionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        let success = false;

        if (input.id) {
          // Test existing configuration
          const provider = await StorageFactory.createFromConfig(
            input.id,
            userId
          );
          success = await provider.testConnection();

          // Update last tested timestamp
          await db
            .update(storageConfig)
            .set({
              lastTestedAt: new Date(),
              lastTestSuccess: success,
            })
            .where(
              and(
                eq(storageConfig.id, input.id),
                eq(storageConfig.userId, userId)
              )
            );
        } else if (input.providerType && input.credentials) {
          // Test new credentials without saving
          success = await StorageFactory.testConnection(
            input.providerType,
            input.credentials
          );
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Either id or providerType and credentials are required",
          });
        }

        return {
          success,
          message: success
            ? "Connection successful"
            : "Connection failed. Please check your credentials.",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error("Test connection error:", error);
        return {
          success: false,
          message: "Connection test failed",
        };
      }
    }),

  /**
   * Get storage usage statistics
   */
  getUsage: protectedProcedure
    .input(getStorageConfigSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const provider = await StorageFactory.createFromConfig(
          input.id,
          userId
        );
        const usage = await provider.getUsage();

        return usage;
      } catch (error) {
        console.error("Get storage usage error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get storage usage",
        });
      }
    }),
});

export type StorageRouter = typeof storageRouter;
