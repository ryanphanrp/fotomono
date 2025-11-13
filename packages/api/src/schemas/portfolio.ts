import { z } from "zod";

/**
 * Sort order options for portfolio
 */
export const portfolioSortEnum = z.enum([
	"date_asc",
	"date_desc",
	"position",
	"category",
]);

export type PortfolioSort = z.infer<typeof portfolioSortEnum>;

/**
 * List portfolio images
 */
export const listPortfolioSchema = z.object({
	sortBy: portfolioSortEnum.optional(),
	category: z.string().optional(),
	tags: z.array(z.string()).optional(),
	limit: z.number().min(1).max(100).default(50).optional(),
	offset: z.number().min(0).default(0).optional(),
});

export type ListPortfolioInput = z.infer<typeof listPortfolioSchema>;

/**
 * Add image to portfolio
 */
export const addToPortfolioSchema = z.object({
	imageId: z.string().min(1, "Image ID is required"),
	category: z.string().max(100).optional(),
	tags: z.array(z.string()).optional(),
});

export type AddToPortfolioInput = z.infer<typeof addToPortfolioSchema>;

/**
 * Remove from portfolio
 */
export const removeFromPortfolioSchema = z.object({
	portfolioImageId: z.string().min(1, "Portfolio image ID is required"),
});

export type RemoveFromPortfolioInput = z.infer<
	typeof removeFromPortfolioSchema
>;

/**
 * Update portfolio image
 */
export const updatePortfolioImageSchema = z.object({
	portfolioImageId: z.string().min(1, "Portfolio image ID is required"),
	category: z.string().max(100).optional(),
	tags: z.array(z.string()).optional(),
});

export type UpdatePortfolioImageInput = z.infer<
	typeof updatePortfolioImageSchema
>;

/**
 * Reorder portfolio images
 */
export const reorderPortfolioSchema = z.object({
	imageOrders: z
		.array(
			z.object({
				id: z.string(),
				position: z.number().int().min(0),
			}),
		)
		.min(1, "At least one image order is required"),
});

export type ReorderPortfolioInput = z.infer<typeof reorderPortfolioSchema>;

/**
 * Get categories
 */
export const getCategoriesSchema = z.object({
	// No input needed, will use userId from context
});

export type GetCategoriesInput = z.infer<typeof getCategoriesSchema>;
