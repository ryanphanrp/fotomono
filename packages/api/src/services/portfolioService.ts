import { db } from "@fotomono/db";
import { portfolioImage, image, show } from "@fotomono/db/schema";
import { eq, and, desc, asc, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export type SortOrder = "date_asc" | "date_desc" | "position" | "category";
export type PortfolioFilter = {
	category?: string;
	tags?: string[];
	limit?: number;
	offset?: number;
};

/**
 * Portfolio Service
 * Handles portfolio organization and management logic
 */
export class PortfolioService {
	/**
	 * Get all portfolio images for a user with filtering and sorting
	 */
	async listPortfolioImages(
		userId: string,
		options: {
			sortBy?: SortOrder;
			category?: string;
			tags?: string[];
			limit?: number;
			offset?: number;
		} = {},
	) {
		const {
			sortBy = "position",
			category,
			tags,
			limit = 50,
			offset = 0,
		} = options;

		// Build query
		let query = db
			.select({
				id: portfolioImage.id,
				imageId: portfolioImage.imageId,
				category: portfolioImage.category,
				tags: portfolioImage.tags,
				position: portfolioImage.position,
				publishedAt: portfolioImage.publishedAt,
				// Image details
				filename: image.filename,
				thumbnailSmallUrl: image.thumbnailSmallUrl,
				thumbnailMediumUrl: image.thumbnailMediumUrl,
				thumbnailLargeUrl: image.thumbnailLargeUrl,
				url: image.url,
				width: image.width,
				height: image.height,
			})
			.from(portfolioImage)
			.innerJoin(image, eq(portfolioImage.imageId, image.id))
			.where(eq(portfolioImage.userId, userId));

		// Apply category filter
		if (category) {
			query = query.where(eq(portfolioImage.category, category));
		}

		// Apply tag filter (check if any of the provided tags match)
		if (tags && tags.length > 0) {
			// This requires checking if the JSON array contains any of the tags
			// Drizzle doesn't have great JSON operators, so we'll filter in memory
		}

		// Apply sorting
		switch (sortBy) {
			case "date_asc":
				query = query.orderBy(asc(portfolioImage.publishedAt));
				break;
			case "date_desc":
				query = query.orderBy(desc(portfolioImage.publishedAt));
				break;
			case "category":
				query = query.orderBy(
					asc(portfolioImage.category),
					asc(portfolioImage.position),
				);
				break;
			case "position":
			default:
				query = query.orderBy(asc(portfolioImage.position));
				break;
		}

		// Apply pagination
		const results = await query.limit(limit).offset(offset);

		// Filter by tags in memory if needed
		if (tags && tags.length > 0) {
			return results.filter((item) => {
				const itemTags = (item.tags as string[]) || [];
				return tags.some((tag) => itemTags.includes(tag));
			});
		}

		return results;
	}

	/**
	 * Add an image to portfolio
	 */
	async addImageToPortfolio(
		userId: string,
		imageId: string,
		options: {
			category?: string;
			tags?: string[];
		} = {},
	) {
		// Check if image exists and belongs to user (via show)
		const imageExists = await db
			.select()
			.from(image)
			.innerJoin(show, eq(image.showId, show.id))
			.where(and(eq(image.id, imageId), eq(show.userId, userId)))
			.limit(1);

		if (!imageExists || imageExists.length === 0) {
			throw new Error("Image not found or unauthorized");
		}

		// Check if already in portfolio
		const existing = await db
			.select()
			.from(portfolioImage)
			.where(
				and(
					eq(portfolioImage.userId, userId),
					eq(portfolioImage.imageId, imageId),
				),
			)
			.limit(1);

		if (existing && existing.length > 0) {
			throw new Error("Image already in portfolio");
		}

		// Get next position
		const maxPosition = await db
			.select({ max: sql<number>`MAX(${portfolioImage.position})` })
			.from(portfolioImage)
			.where(eq(portfolioImage.userId, userId));

		const nextPosition = (maxPosition[0]?.max || 0) + 1;

		// Add to portfolio
		const result = await db
			.insert(portfolioImage)
			.values({
				id: nanoid(),
				userId,
				imageId,
				category: options.category || null,
				tags: options.tags || [],
				position: nextPosition,
				publishedAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		return result[0];
	}

	/**
	 * Remove an image from portfolio
	 */
	async removeImageFromPortfolio(userId: string, portfolioImageId: string) {
		// Check ownership
		const existing = await db
			.select()
			.from(portfolioImage)
			.where(
				and(
					eq(portfolioImage.id, portfolioImageId),
					eq(portfolioImage.userId, userId),
				),
			)
			.limit(1);

		if (!existing || existing.length === 0) {
			throw new Error("Portfolio image not found or unauthorized");
		}

		// Delete
		await db
			.delete(portfolioImage)
			.where(
				and(
					eq(portfolioImage.id, portfolioImageId),
					eq(portfolioImage.userId, userId),
				),
			);

		return { success: true };
	}

	/**
	 * Reorder portfolio images
	 */
	async reorderPortfolioImages(
		userId: string,
		imageOrders: Array<{ id: string; position: number }>,
	) {
		// Verify all images belong to user
		const imageIds = imageOrders.map((item) => item.id);
		const existingImages = await db
			.select()
			.from(portfolioImage)
			.where(
				and(
					eq(portfolioImage.userId, userId),
					inArray(portfolioImage.id, imageIds),
				),
			);

		if (existingImages.length !== imageIds.length) {
			throw new Error("Some portfolio images not found or unauthorized");
		}

		// Update positions
		for (const item of imageOrders) {
			await db
				.update(portfolioImage)
				.set({
					position: item.position,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(portfolioImage.id, item.id),
						eq(portfolioImage.userId, userId),
					),
				);
		}

		return { success: true };
	}

	/**
	 * Update portfolio image metadata (category, tags)
	 */
	async updatePortfolioImage(
		userId: string,
		portfolioImageId: string,
		updates: {
			category?: string;
			tags?: string[];
		},
	) {
		// Check ownership
		const existing = await db
			.select()
			.from(portfolioImage)
			.where(
				and(
					eq(portfolioImage.id, portfolioImageId),
					eq(portfolioImage.userId, userId),
				),
			)
			.limit(1);

		if (!existing || existing.length === 0) {
			throw new Error("Portfolio image not found or unauthorized");
		}

		// Update
		const result = await db
			.update(portfolioImage)
			.set({
				...(updates.category !== undefined && { category: updates.category }),
				...(updates.tags !== undefined && { tags: updates.tags }),
				updatedAt: new Date(),
			})
			.where(
				and(
					eq(portfolioImage.id, portfolioImageId),
					eq(portfolioImage.userId, userId),
				),
			)
			.returning();

		return result[0];
	}

	/**
	 * Get all unique categories used in portfolio
	 */
	async getCategories(userId: string): Promise<string[]> {
		const results = await db
			.selectDistinct({ category: portfolioImage.category })
			.from(portfolioImage)
			.where(eq(portfolioImage.userId, userId));

		return results
			.map((r) => r.category)
			.filter((c): c is string => c !== null);
	}

	/**
	 * Get all unique tags used in portfolio
	 */
	async getAllTags(userId: string): Promise<string[]> {
		const results = await db
			.select({ tags: portfolioImage.tags })
			.from(portfolioImage)
			.where(eq(portfolioImage.userId, userId));

		const allTags = new Set<string>();
		for (const result of results) {
			const tags = (result.tags as string[]) || [];
			for (const tag of tags) {
				allTags.add(tag);
			}
		}

		return Array.from(allTags).sort();
	}
}

/**
 * Singleton instance
 */
export const portfolioService = new PortfolioService();
