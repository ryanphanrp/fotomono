import { db } from "@fotomono/db";
import {
	clientFeedback,
	clientAlbumLink,
	clientAlbum,
} from "@fotomono/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Feedback Service
 * Handles client feedback and rating submission
 */
export class FeedbackService {
	/**
	 * Submit feedback for an album (public - via token)
	 */
	async submitFeedback(
		token: string,
		data: {
			rating?: number;
			feedbackText?: string;
			clientName?: string;
			clientEmail?: string;
		},
	) {
		// Verify token
		const link = await db
			.select()
			.from(clientAlbumLink)
			.where(eq(clientAlbumLink.token, token))
			.limit(1);

		if (!link || link.length === 0) {
			throw new Error("Album link not found");
		}

		const linkData = link[0];

		// Check active and expiration
		if (!linkData.isActive) {
			throw new Error("Album link is deactivated");
		}

		if (linkData.expirationDate && linkData.expirationDate < new Date()) {
			throw new Error("Album link has expired");
		}

		// Validate rating
		if (data.rating && (data.rating < 1 || data.rating > 5)) {
			throw new Error("Rating must be between 1 and 5");
		}

		// Create feedback
		const feedback = await db
			.insert(clientFeedback)
			.values({
				id: nanoid(),
				linkId: linkData.id,
				rating: data.rating || null,
				feedbackText: data.feedbackText || null,
				clientName: data.clientName || null,
				clientEmail: data.clientEmail || null,
				createdAt: new Date(),
			})
			.returning();

		return feedback[0];
	}

	/**
	 * Get all feedback for an album (photographer only)
	 */
	async getFeedbackByAlbum(userId: string, albumId: string) {
		// Verify album ownership
		const album = await db
			.select()
			.from(clientAlbum)
			.where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
			.limit(1);

		if (!album || album.length === 0) {
			throw new Error("Album not found or unauthorized");
		}

		// Get feedback via album links
		const feedback = await db
			.select({
				id: clientFeedback.id,
				rating: clientFeedback.rating,
				feedbackText: clientFeedback.feedbackText,
				clientName: clientFeedback.clientName,
				clientEmail: clientFeedback.clientEmail,
				createdAt: clientFeedback.createdAt,
				linkId: clientAlbumLink.id,
				linkToken: clientAlbumLink.token,
			})
			.from(clientFeedback)
			.innerJoin(
				clientAlbumLink,
				eq(clientFeedback.linkId, clientAlbumLink.id),
			)
			.where(eq(clientAlbumLink.albumId, albumId))
			.orderBy(desc(clientFeedback.createdAt));

		return feedback;
	}

	/**
	 * Get feedback statistics for an album
	 */
	async getFeedbackStats(userId: string, albumId: string) {
		const feedback = await this.getFeedbackByAlbum(userId, albumId);

		const totalFeedback = feedback.length;
		const ratingsOnly = feedback.filter((f) => f.rating !== null);
		const totalRatings = ratingsOnly.length;
		const averageRating =
			totalRatings > 0
				? ratingsOnly.reduce((sum, f) => sum + (f.rating || 0), 0) /
					totalRatings
				: 0;

		const ratingDistribution = {
			1: ratingsOnly.filter((f) => f.rating === 1).length,
			2: ratingsOnly.filter((f) => f.rating === 2).length,
			3: ratingsOnly.filter((f) => f.rating === 3).length,
			4: ratingsOnly.filter((f) => f.rating === 4).length,
			5: ratingsOnly.filter((f) => f.rating === 5).length,
		};

		return {
			totalFeedback,
			totalRatings,
			averageRating: Math.round(averageRating * 10) / 10,
			ratingDistribution,
		};
	}
}

/**
 * Singleton instance
 */
export const feedbackService = new FeedbackService();
