import { db } from "@fotomono/db";
import {
  image,
  portfolioImage,
  portfolioSettings,
  show,
} from "@fotomono/db/schema";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
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
    } = {}
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
          asc(portfolioImage.position)
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
    } = {}
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
          eq(portfolioImage.imageId, imageId)
        )
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
          eq(portfolioImage.userId, userId)
        )
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
          eq(portfolioImage.userId, userId)
        )
      );

    return { success: true };
  }

  /**
   * Reorder portfolio images
   */
  async reorderPortfolioImages(
    userId: string,
    imageOrders: Array<{ id: string; position: number }>
  ) {
    // Verify all images belong to user
    const imageIds = imageOrders.map((item) => item.id);
    const existingImages = await db
      .select()
      .from(portfolioImage)
      .where(
        and(
          eq(portfolioImage.userId, userId),
          inArray(portfolioImage.id, imageIds)
        )
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
          and(eq(portfolioImage.id, item.id), eq(portfolioImage.userId, userId))
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
    }
  ) {
    // Check ownership
    const existing = await db
      .select()
      .from(portfolioImage)
      .where(
        and(
          eq(portfolioImage.id, portfolioImageId),
          eq(portfolioImage.userId, userId)
        )
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
          eq(portfolioImage.userId, userId)
        )
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

  /**
   * Get portfolio settings for a user
   */
  async getSettings(userId: string) {
    const settings = await db
      .select()
      .from(portfolioSettings)
      .where(eq(portfolioSettings.userId, userId))
      .limit(1);

    return settings[0] || null;
  }

  /**
   * Get public portfolio data by subdomain
   */
  async getPublicData(subdomain: string) {
    // Get settings
    const settings = await db
      .select()
      .from(portfolioSettings)
      .where(eq(portfolioSettings.subdomain, subdomain))
      .limit(1);

    if (!settings || settings.length === 0) {
      throw new Error("Portfolio not found");
    }

    const portfolioData = settings[0];

    // Get published portfolio images
    const images = await db
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
      .where(eq(portfolioImage.userId, portfolioData.userId))
      .orderBy(asc(portfolioImage.position));

    return {
      settings: portfolioData,
      images,
    };
  }

  /**
   * Update or create portfolio settings
   */
  async updateSettings(
    userId: string,
    data: {
      subdomain?: string;
      theme?: string;
      primaryColor?: string;
      accentColor?: string;
      bio?: string;
      logoUrl?: string;
      profileImageUrl?: string;
      contactEmail?: string;
      contactPhone?: string;
      socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        pinterest?: string;
        website?: string;
      };
      metaTitle?: string;
      metaDescription?: string;
    }
  ) {
    // Check if settings exist
    const existing = await db
      .select()
      .from(portfolioSettings)
      .where(eq(portfolioSettings.userId, userId))
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing
      const updated = await db
        .update(portfolioSettings)
        .set({
          ...(data.subdomain !== undefined && { subdomain: data.subdomain }),
          ...(data.theme !== undefined && { theme: data.theme }),
          ...(data.primaryColor !== undefined && {
            primaryColor: data.primaryColor,
          }),
          ...(data.accentColor !== undefined && {
            accentColor: data.accentColor,
          }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
          ...(data.profileImageUrl !== undefined && {
            profileImageUrl: data.profileImageUrl,
          }),
          ...(data.contactEmail !== undefined && {
            contactEmail: data.contactEmail,
          }),
          ...(data.contactPhone !== undefined && {
            contactPhone: data.contactPhone,
          }),
          ...(data.socialLinks !== undefined && {
            socialLinks: data.socialLinks,
          }),
          ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
          ...(data.metaDescription !== undefined && {
            metaDescription: data.metaDescription,
          }),
          updatedAt: new Date(),
        })
        .where(eq(portfolioSettings.id, existing[0].id))
        .returning();

      return updated[0];
    }

    // Create new settings - subdomain is required
    if (!data.subdomain) {
      throw new Error("Subdomain is required for new portfolio settings");
    }

    const created = await db
      .insert(portfolioSettings)
      .values({
        id: nanoid(),
        userId,
        subdomain: data.subdomain,
        theme: data.theme || "default",
        primaryColor: data.primaryColor || "#000000",
        accentColor: data.accentColor || "#FF6B6B",
        bio: data.bio || null,
        logoUrl: data.logoUrl || null,
        profileImageUrl: data.profileImageUrl || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        socialLinks: data.socialLinks || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return created[0];
  }

  /**
   * Check if subdomain is available
   */
  async checkSubdomainAvailability(
    subdomain: string,
    currentUserId?: string
  ): Promise<boolean> {
    const existing = await db
      .select()
      .from(portfolioSettings)
      .where(eq(portfolioSettings.subdomain, subdomain))
      .limit(1);

    // If no existing, it's available
    if (!existing || existing.length === 0) {
      return true;
    }

    // If belongs to current user, it's available (for updating)
    if (currentUserId && existing[0].userId === currentUserId) {
      return true;
    }

    return false;
  }
}

/**
 * Singleton instance
 */
export const portfolioService = new PortfolioService();
