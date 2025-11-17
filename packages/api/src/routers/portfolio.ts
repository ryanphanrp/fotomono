import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../index";
import {
	listPortfolioSchema,
	addToPortfolioSchema,
	removeFromPortfolioSchema,
	updatePortfolioImageSchema,
	reorderPortfolioSchema,
	getCategoriesSchema,
	getPublicDataSchema,
	updateSettingsSchema,
	checkSubdomainSchema,
} from "../schemas/portfolio";
import { portfolioService } from "../services/portfolioService";

/**
 * Portfolio router
 * Handles portfolio management and organization
 */
export const portfolioRouter = router({
	/**
	 * List portfolio images with filtering and sorting
	 */
	list: protectedProcedure
		.input(listPortfolioSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const images = await portfolioService.listPortfolioImages(
					userId,
					input,
				);

				return {
					images,
					total: images.length,
				};
			} catch (error) {
				console.error("List portfolio images error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch portfolio images",
				});
			}
		}),

	/**
	 * Add image to portfolio
	 */
	addImage: protectedProcedure
		.input(addToPortfolioSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const portfolioImage = await portfolioService.addImageToPortfolio(
					userId,
					input.imageId,
					{
						category: input.category,
						tags: input.tags,
					},
				);

				return {
					success: true,
					message: "Image added to portfolio",
					portfolioImage,
				};
			} catch (error) {
				if (error instanceof Error) {
					if (
						error.message === "Image not found or unauthorized" ||
						error.message === "Image already in portfolio"
					) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: error.message,
						});
					}
				}

				console.error("Add to portfolio error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to add image to portfolio",
				});
			}
		}),

	/**
	 * Remove image from portfolio
	 */
	removeImage: protectedProcedure
		.input(removeFromPortfolioSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				await portfolioService.removeImageFromPortfolio(
					userId,
					input.portfolioImageId,
				);

				return {
					success: true,
					message: "Image removed from portfolio",
				};
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Portfolio image not found or unauthorized") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: error.message,
						});
					}
				}

				console.error("Remove from portfolio error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to remove image from portfolio",
				});
			}
		}),

	/**
	 * Update portfolio image metadata
	 */
	updateImage: protectedProcedure
		.input(updatePortfolioImageSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const portfolioImage = await portfolioService.updatePortfolioImage(
					userId,
					input.portfolioImageId,
					{
						category: input.category,
						tags: input.tags,
					},
				);

				return {
					success: true,
					message: "Portfolio image updated",
					portfolioImage,
				};
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Portfolio image not found or unauthorized") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: error.message,
						});
					}
				}

				console.error("Update portfolio image error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update portfolio image",
				});
			}
		}),

	/**
	 * Reorder portfolio images
	 */
	organize: protectedProcedure
		.input(reorderPortfolioSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				await portfolioService.reorderPortfolioImages(
					userId,
					input.imageOrders,
				);

				return {
					success: true,
					message: "Portfolio images reordered",
				};
			} catch (error) {
				if (error instanceof Error) {
					if (
						error.message === "Some portfolio images not found or unauthorized"
					) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: error.message,
						});
					}
				}

				console.error("Reorder portfolio images error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to reorder portfolio images",
				});
			}
		}),

	/**
	 * Get all categories used in portfolio
	 */
	getCategories: protectedProcedure
		.input(getCategoriesSchema)
		.query(async ({ ctx }) => {
			try {
				const userId = ctx.session.user.id;

				const categories = await portfolioService.getCategories(userId);

				return {
					categories,
				};
			} catch (error) {
				console.error("Get portfolio categories error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch portfolio categories",
				});
			}
		}),

	/**
	 * Get all tags used in portfolio
	 */
	getTags: protectedProcedure.query(async ({ ctx }) => {
		try {
			const userId = ctx.session.user.id;

			const tags = await portfolioService.getAllTags(userId);

			return {
				tags,
			};
		} catch (error) {
			console.error("Get portfolio tags error:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch portfolio tags",
			});
		}
	}),

	/**
	 * Get portfolio settings (protected)
	 */
	getSettings: protectedProcedure.query(async ({ ctx }) => {
		try {
			const userId = ctx.session.user.id;

			const settings = await portfolioService.getSettings(userId);

			return settings;
		} catch (error) {
			console.error("Get portfolio settings error:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch portfolio settings",
			});
		}
	}),

	/**
	 * Get public portfolio data by subdomain (public)
	 */
	getPublicData: publicProcedure
		.input(getPublicDataSchema)
		.query(async ({ input }) => {
			try {
				const data = await portfolioService.getPublicData(input.subdomain);

				return data;
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Portfolio not found") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: error.message,
						});
					}
				}

				console.error("Get public portfolio data error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch portfolio data",
				});
			}
		}),

	/**
	 * Update portfolio settings (protected)
	 */
	updateSettings: protectedProcedure
		.input(updateSettingsSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Check subdomain availability if provided
				if (input.subdomain) {
					const isAvailable = await portfolioService.checkSubdomainAvailability(
						input.subdomain,
						userId,
					);
					if (!isAvailable) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Subdomain is already taken",
						});
					}
				}

				const settings = await portfolioService.updateSettings(userId, input);

				return {
					success: true,
					message: "Portfolio settings updated successfully",
					settings,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				if (error instanceof Error) {
					if (error.message === "Subdomain is required for new portfolio settings") {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: error.message,
						});
					}
				}

				console.error("Update portfolio settings error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update portfolio settings",
				});
			}
		}),

	/**
	 * Check subdomain availability (protected)
	 */
	checkSubdomain: protectedProcedure
		.input(checkSubdomainSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const isAvailable = await portfolioService.checkSubdomainAvailability(
					input.subdomain,
					userId,
				);

				return {
					available: isAvailable,
				};
			} catch (error) {
				console.error("Check subdomain availability error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to check subdomain availability",
				});
			}
		}),
});

export type PortfolioRouter = typeof portfolioRouter;
