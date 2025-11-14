import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../index";
import {
	createAlbumSchema,
	updateAlbumSchema,
	getAlbumByIdSchema,
	deleteAlbumSchema,
	addImagesToAlbumSchema,
	removeImagesFromAlbumSchema,
	reorderAlbumImagesSchema,
} from "../schemas/album";
import { albumService } from "../services/albumService";

/**
 * Albums router
 * Handles client album CRUD operations
 */
export const albumsRouter = router({
	/**
	 * Create new album
	 */
	create: protectedProcedure
		.input(createAlbumSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const album = await albumService.createAlbum(userId, input);

				return {
					success: true,
					message: "Album created successfully",
					album,
				};
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Show not found or unauthorized") {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: error.message,
						});
					}
				}

				console.error("Create album error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create album",
				});
			}
		}),

	/**
	 * List all albums
	 */
	list: protectedProcedure.query(async ({ ctx }) => {
		try {
			const userId = ctx.session.user.id;

			const albums = await albumService.listAlbums(userId);

			return {
				albums,
				total: albums.length,
			};
		} catch (error) {
			console.error("List albums error:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch albums",
			});
		}
	}),

	/**
	 * Get album by ID with images
	 */
	getById: protectedProcedure
		.input(getAlbumByIdSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const album = await albumService.getAlbumById(userId, input.albumId);

				return album;
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Album not found or unauthorized") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: error.message,
						});
					}
				}

				console.error("Get album error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch album",
				});
			}
		}),

	/**
	 * Update album
	 */
	update: protectedProcedure
		.input(updateAlbumSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const album = await albumService.updateAlbum(userId, input.albumId, {
					name: input.name,
					description: input.description,
				});

				return {
					success: true,
					message: "Album updated successfully",
					album,
				};
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Album not found or unauthorized") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: error.message,
						});
					}
				}

				console.error("Update album error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update album",
				});
			}
		}),

	/**
	 * Delete album
	 */
	delete: protectedProcedure
		.input(deleteAlbumSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				await albumService.deleteAlbum(userId, input.albumId);

				return {
					success: true,
					message: "Album deleted successfully",
				};
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Album not found or unauthorized") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: error.message,
						});
					}
				}

				console.error("Delete album error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete album",
				});
			}
		}),

	/**
	 * Add images to album
	 */
	addImages: protectedProcedure
		.input(addImagesToAlbumSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const albumImages = await albumService.addImages(
					userId,
					input.albumId,
					input.imageIds,
				);

				return {
					success: true,
					message: `${albumImages.length} images added to album`,
					albumImages,
				};
			} catch (error) {
				if (error instanceof Error) {
					if (
						error.message === "Album not found or unauthorized" ||
						error.message === "Some images not found or not in album's show"
					) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: error.message,
						});
					}
				}

				console.error("Add images to album error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to add images to album",
				});
			}
		}),

	/**
	 * Remove images from album
	 */
	removeImages: protectedProcedure
		.input(removeImagesFromAlbumSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				await albumService.removeImages(
					userId,
					input.albumId,
					input.albumImageIds,
				);

				return {
					success: true,
					message: "Images removed from album",
				};
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Album not found or unauthorized") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: error.message,
						});
					}
				}

				console.error("Remove images from album error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to remove images from album",
				});
			}
		}),

	/**
	 * Reorder images in album
	 */
	reorderImages: protectedProcedure
		.input(reorderAlbumImagesSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				await albumService.reorderImages(
					userId,
					input.albumId,
					input.imageOrders,
				);

				return {
					success: true,
					message: "Images reordered successfully",
				};
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Album not found or unauthorized") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: error.message,
						});
					}
				}

				console.error("Reorder album images error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to reorder images",
				});
			}
		}),
});

export type AlbumsRouter = typeof albumsRouter;
