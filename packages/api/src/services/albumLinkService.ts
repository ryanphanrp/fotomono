import { db } from "@fotomono/db";
import {
	clientAlbumLink,
	clientAlbum,
	clientAlbumImage,
	image,
} from "@fotomono/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Album Link Service
 * Handles shareable link generation, validation, and analytics
 */
export class AlbumLinkService {
	/**
	 * Create shareable link for album
	 */
	async createLink(
		userId: string,
		albumId: string,
		options: {
			expirationDate?: Date;
			allowDownload?: boolean;
		} = {},
	) {
		const { expirationDate, allowDownload = true } = options;

		// Verify album ownership
		const album = await db
			.select()
			.from(clientAlbum)
			.where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
			.limit(1);

		if (!album || album.length === 0) {
			throw new Error("Album not found or unauthorized");
		}

		// Generate unique token
		const token = nanoid(32);

		// Create link
		const link = await db
			.insert(clientAlbumLink)
			.values({
				id: nanoid(),
				albumId,
				token,
				expirationDate: expirationDate || null,
				allowDownload,
				isActive: true,
				accessedCount: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		return link[0];
	}

	/**
	 * Get album by token (public access)
	 */
	async getByToken(token: string) {
		// Get link
		const link = await db
			.select()
			.from(clientAlbumLink)
			.where(eq(clientAlbumLink.token, token))
			.limit(1);

		if (!link || link.length === 0) {
			throw new Error("Album link not found");
		}

		const linkData = link[0];

		// Check if active
		if (!linkData.isActive) {
			throw new Error("Album link is deactivated");
		}

		// Check expiration
		if (linkData.expirationDate && linkData.expirationDate < new Date()) {
			throw new Error("Album link has expired");
		}

		// Update analytics
		await db
			.update(clientAlbumLink)
			.set({
				accessedCount: linkData.accessedCount + 1,
				lastAccessedAt: new Date(),
			})
			.where(eq(clientAlbumLink.id, linkData.id));

		// Get album details
		const album = await db
			.select()
			.from(clientAlbum)
			.where(eq(clientAlbum.id, linkData.albumId))
			.limit(1);

		if (!album || album.length === 0) {
			throw new Error("Album not found");
		}

		// Get images
		const images = await db
			.select({
				albumImageId: clientAlbumImage.id,
				position: clientAlbumImage.position,
				imageId: image.id,
				filename: image.filename,
				url: image.url,
				thumbnailSmallUrl: image.thumbnailSmallUrl,
				thumbnailMediumUrl: image.thumbnailMediumUrl,
				thumbnailLargeUrl: image.thumbnailLargeUrl,
				width: image.width,
				height: image.height,
			})
			.from(clientAlbumImage)
			.innerJoin(image, eq(clientAlbumImage.imageId, image.id))
			.where(eq(clientAlbumImage.albumId, linkData.albumId))
			.orderBy(clientAlbumImage.position);

		return {
			album: {
				name: album[0].name,
				description: album[0].description,
			},
			images,
			allowDownload: linkData.allowDownload,
			expiresAt: linkData.expirationDate,
		};
	}

	/**
	 * List all links for an album
	 */
	async listLinks(userId: string, albumId: string) {
		// Verify album ownership
		const album = await db
			.select()
			.from(clientAlbum)
			.where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
			.limit(1);

		if (!album || album.length === 0) {
			throw new Error("Album not found or unauthorized");
		}

		// Get links
		const links = await db
			.select()
			.from(clientAlbumLink)
			.where(eq(clientAlbumLink.albumId, albumId))
			.orderBy(desc(clientAlbumLink.createdAt));

		return links;
	}

	/**
	 * Update link settings
	 */
	async updateLink(
		userId: string,
		linkId: string,
		data: {
			expirationDate?: Date | null;
			allowDownload?: boolean;
			isActive?: boolean;
		},
	) {
		// Verify ownership via album
		const link = await db
			.select({
				linkId: clientAlbumLink.id,
				albumId: clientAlbumLink.albumId,
				userId: clientAlbum.userId,
			})
			.from(clientAlbumLink)
			.innerJoin(clientAlbum, eq(clientAlbumLink.albumId, clientAlbum.id))
			.where(eq(clientAlbumLink.id, linkId))
			.limit(1);

		if (!link || link.length === 0 || link[0].userId !== userId) {
			throw new Error("Link not found or unauthorized");
		}

		// Update
		const updated = await db
			.update(clientAlbumLink)
			.set({
				expirationDate: data.expirationDate,
				allowDownload: data.allowDownload,
				isActive: data.isActive,
				updatedAt: new Date(),
			})
			.where(eq(clientAlbumLink.id, linkId))
			.returning();

		return updated[0];
	}

	/**
	 * Delete/deactivate link
	 */
	async deleteLink(userId: string, linkId: string) {
		// Verify ownership via album
		const link = await db
			.select({
				linkId: clientAlbumLink.id,
				albumId: clientAlbumLink.albumId,
				userId: clientAlbum.userId,
			})
			.from(clientAlbumLink)
			.innerJoin(clientAlbum, eq(clientAlbumLink.albumId, clientAlbum.id))
			.where(eq(clientAlbumLink.id, linkId))
			.limit(1);

		if (!link || link.length === 0 || link[0].userId !== userId) {
			throw new Error("Link not found or unauthorized");
		}

		// Deactivate instead of delete (keep analytics)
		await db
			.update(clientAlbumLink)
			.set({
				isActive: false,
				updatedAt: new Date(),
			})
			.where(eq(clientAlbumLink.id, linkId));

		return { success: true };
	}

	/**
	 * Get link analytics
	 */
	async getLinkStats(userId: string, albumId: string) {
		// Verify album ownership
		const album = await db
			.select()
			.from(clientAlbum)
			.where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
			.limit(1);

		if (!album || album.length === 0) {
			throw new Error("Album not found or unauthorized");
		}

		// Get links with stats
		const links = await db
			.select({
				id: clientAlbumLink.id,
				token: clientAlbumLink.token,
				isActive: clientAlbumLink.isActive,
				expirationDate: clientAlbumLink.expirationDate,
				accessedCount: clientAlbumLink.accessedCount,
				lastAccessedAt: clientAlbumLink.lastAccessedAt,
				createdAt: clientAlbumLink.createdAt,
			})
			.from(clientAlbumLink)
			.where(eq(clientAlbumLink.albumId, albumId))
			.orderBy(desc(clientAlbumLink.createdAt));

		return links;
	}

	/**
	 * Generate download URL for image
	 */
	async getImageDownloadUrl(token: string, imageId: string) {
		// Verify token and download permission
		const link = await db
			.select()
			.from(clientAlbumLink)
			.where(eq(clientAlbumLink.token, token))
			.limit(1);

		if (!link || link.length === 0) {
			throw new Error("Album link not found");
		}

		const linkData = link[0];

		// Check active, expiration, and download permission
		if (!linkData.isActive) {
			throw new Error("Album link is deactivated");
		}

		if (linkData.expirationDate && linkData.expirationDate < new Date()) {
			throw new Error("Album link has expired");
		}

		if (!linkData.allowDownload) {
			throw new Error("Download is not allowed for this album");
		}

		// Verify image is in album
		const albumImage = await db
			.select({
				imageUrl: image.url,
				filename: image.filename,
			})
			.from(clientAlbumImage)
			.innerJoin(image, eq(clientAlbumImage.imageId, image.id))
			.where(
				and(
					eq(clientAlbumImage.albumId, linkData.albumId),
					eq(clientAlbumImage.imageId, imageId),
				),
			)
			.limit(1);

		if (!albumImage || albumImage.length === 0) {
			throw new Error("Image not found in album");
		}

		// Return image URL (in production, this would be a presigned URL)
		return {
			url: albumImage[0].imageUrl,
			filename: albumImage[0].filename,
		};
	}
}

/**
 * Singleton instance
 */
export const albumLinkService = new AlbumLinkService();
