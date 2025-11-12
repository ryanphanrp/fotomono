import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../index";
import {
	getImagesByShowSchema,
	getImageByIdSchema,
	updateImageSchema,
	updateImageTagsSchema,
	markForPortfolioSchema,
	archiveImageSchema,
	deleteImageSchema,
	bulkUpdateImagesSchema,
	searchImagesSchema,
} from "../schemas/image";
import { db } from "@fotomono/db";
import { image } from "@fotomono/db/schema/images";
import { eq, and, or, like, inArray } from "drizzle-orm";
import { StorageFactory } from "../storage/StorageFactory";

/**
 * Images router
 * Handles image upload, management, and organization
 */
export const imagesRouter = router({
	/**
	 * Get images for a show
	 */
	getByShow: protectedProcedure
		.input(getImagesByShowSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Build where conditions
				const conditions = [
					eq(image.userId, userId),
					eq(image.showId, input.showId),
				];

				if (input.filter === "portfolio") {
					conditions.push(eq(image.isPortfolio, true));
				} else if (input.filter === "archived") {
					conditions.push(eq(image.isArchived, true));
				}

				// Query images
				const images = await db
					.select()
					.from(image)
					.where(and(...conditions))
					.limit(input.limit || 50)
					.offset(input.offset || 0)
					.orderBy(image.createdAt);

				return {
					images,
					total: images.length,
				};
			} catch (error) {
				console.error("Get images by show error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch images",
				});
			}
		}),

	/**
	 * Get image by ID
	 */
	getById: protectedProcedure
		.input(getImageByIdSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const foundImage = await db
					.select()
					.from(image)
					.where(and(eq(image.id, input.id), eq(image.userId, userId)))
					.limit(1);

				if (!foundImage || foundImage.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Image not found",
					});
				}

				return foundImage[0];
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Get image error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch image",
				});
			}
		}),

	/**
	 * Update image metadata
	 */
	update: protectedProcedure
		.input(updateImageSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Check if image exists and belongs to user
				const existing = await db
					.select()
					.from(image)
					.where(and(eq(image.id, input.id), eq(image.userId, userId)))
					.limit(1);

				if (!existing || existing.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Image not found",
					});
				}

				// Build update object
				const updateData: Record<string, unknown> = {
					updatedAt: new Date(),
				};

				if (input.filename) updateData.filename = input.filename;
				if (input.tags) updateData.tags = input.tags;
				if (input.category) updateData.category = input.category;
				if (input.caption) updateData.caption = input.caption;
				if (input.altText) updateData.altText = input.altText;

				// Update image
				const updated = await db
					.update(image)
					.set(updateData)
					.where(and(eq(image.id, input.id), eq(image.userId, userId)))
					.returning();

				return {
					success: true,
					message: "Image updated successfully",
					image: updated[0],
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Update image error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update image",
				});
			}
		}),

	/**
	 * Update image tags
	 */
	updateTags: protectedProcedure
		.input(updateImageTagsSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Check if image exists
				const existing = await db
					.select()
					.from(image)
					.where(and(eq(image.id, input.id), eq(image.userId, userId)))
					.limit(1);

				if (!existing || existing.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Image not found",
					});
				}

				// Append or replace tags
				let newTags = input.tags;
				if (input.append && existing[0].tags) {
					const existingTags = existing[0].tags as string[];
					newTags = [...new Set([...existingTags, ...input.tags])];
				}

				// Update tags
				const updated = await db
					.update(image)
					.set({
						tags: newTags,
						updatedAt: new Date(),
					})
					.where(and(eq(image.id, input.id), eq(image.userId, userId)))
					.returning();

				return {
					success: true,
					message: "Tags updated successfully",
					image: updated[0],
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Update tags error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update tags",
				});
			}
		}),

	/**
	 * Mark/unmark image for portfolio
	 */
	markForPortfolio: protectedProcedure
		.input(markForPortfolioSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const updated = await db
					.update(image)
					.set({
						isPortfolio: input.isPortfolio,
						updatedAt: new Date(),
					})
					.where(and(eq(image.id, input.id), eq(image.userId, userId)))
					.returning();

				if (!updated || updated.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Image not found",
					});
				}

				return {
					success: true,
					message: input.isPortfolio
						? "Image marked for portfolio"
						: "Image removed from portfolio",
					image: updated[0],
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Mark for portfolio error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update portfolio status",
				});
			}
		}),

	/**
	 * Archive/unarchive image
	 */
	archive: protectedProcedure
		.input(archiveImageSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const updated = await db
					.update(image)
					.set({
						isArchived: input.isArchived,
						updatedAt: new Date(),
					})
					.where(and(eq(image.id, input.id), eq(image.userId, userId)))
					.returning();

				if (!updated || updated.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Image not found",
					});
				}

				return {
					success: true,
					message: input.isArchived ? "Image archived" : "Image unarchived",
					image: updated[0],
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Archive image error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to archive image",
				});
			}
		}),

	/**
	 * Delete image
	 */
	delete: protectedProcedure
		.input(deleteImageSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Get image details
				const imageToDelete = await db
					.select()
					.from(image)
					.where(and(eq(image.id, input.id), eq(image.userId, userId)))
					.limit(1);

				if (!imageToDelete || imageToDelete.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Image not found",
					});
				}

				// Delete from storage if requested
				if (input.deleteFromStorage) {
					try {
						const provider = await StorageFactory.createDefaultForUser(userId);
						await provider.delete({
							fileId: imageToDelete[0].storageFileId,
						});
					} catch (error) {
						console.error("Failed to delete from storage:", error);
						// Continue with database deletion even if storage deletion fails
					}
				}

				// Delete from database
				await db
					.delete(image)
					.where(and(eq(image.id, input.id), eq(image.userId, userId)));

				return {
					success: true,
					message: "Image deleted successfully",
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Delete image error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete image",
				});
			}
		}),

	/**
	 * Bulk update images
	 */
	bulkUpdate: protectedProcedure
		.input(bulkUpdateImagesSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Verify all images belong to user
				const imagesToUpdate = await db
					.select()
					.from(image)
					.where(
						and(
							inArray(image.id, input.imageIds),
							eq(image.userId, userId),
						),
					);

				if (imagesToUpdate.length !== input.imageIds.length) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "One or more images not found",
					});
				}

				// Perform bulk operation
				let updateData: Record<string, unknown> = { updatedAt: new Date() };

				switch (input.operation) {
					case "mark_portfolio":
						updateData.isPortfolio = true;
						break;
					case "unmark_portfolio":
						updateData.isPortfolio = false;
						break;
					case "archive":
						updateData.isArchived = true;
						break;
					case "unarchive":
						updateData.isArchived = false;
						break;
					case "delete":
						await db
							.delete(image)
							.where(
								and(
									inArray(image.id, input.imageIds),
									eq(image.userId, userId),
								),
							);
						return {
							success: true,
							message: `${input.imageIds.length} images deleted successfully`,
							count: input.imageIds.length,
						};
					default:
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Invalid operation",
						});
				}

				// Apply updates
				await db
					.update(image)
					.set(updateData)
					.where(
						and(
							inArray(image.id, input.imageIds),
							eq(image.userId, userId),
						),
					);

				return {
					success: true,
					message: `${input.imageIds.length} images updated successfully`,
					count: input.imageIds.length,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Bulk update error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update images",
				});
			}
		}),

	/**
	 * Search images
	 */
	search: protectedProcedure
		.input(searchImagesSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Build where conditions
				const conditions = [eq(image.userId, userId)];

				if (input.showId) {
					conditions.push(eq(image.showId, input.showId));
				}

				if (input.isPortfolio !== undefined) {
					conditions.push(eq(image.isPortfolio, input.isPortfolio));
				}

				if (input.isArchived !== undefined) {
					conditions.push(eq(image.isArchived, input.isArchived));
				}

				if (input.category) {
					conditions.push(eq(image.category, input.category));
				}

				if (input.query) {
					conditions.push(
						or(
							like(image.filename, `%${input.query}%`),
							like(image.caption, `%${input.query}%`),
						),
					);
				}

				// Query images
				const images = await db
					.select()
					.from(image)
					.where(and(...conditions))
					.limit(input.limit || 50)
					.offset(input.offset || 0)
					.orderBy(image.createdAt);

				return {
					images,
					total: images.length,
				};
			} catch (error) {
				console.error("Search images error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to search images",
				});
			}
		}),
});

export type ImagesRouter = typeof imagesRouter;
