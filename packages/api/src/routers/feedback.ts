import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../index";
import {
	submitFeedbackSchema,
	getFeedbackByAlbumSchema,
	getFeedbackStatsSchema,
} from "../schemas/feedback";
import { feedbackService } from "../services/feedbackService";

/**
 * Feedback router
 * Handles client feedback and ratings
 */
export const feedbackRouter = router({
	/**
	 * Submit feedback (public)
	 */
	submit: publicProcedure
		.input(submitFeedbackSchema)
		.mutation(async ({ input }) => {
			try {
				const feedback = await feedbackService.submitFeedback(input.token, {
					rating: input.rating,
					feedbackText: input.feedbackText,
					clientName: input.clientName,
					clientEmail: input.clientEmail,
				});

				return {
					success: true,
					message: "Thank you for your feedback!",
					feedback,
				};
			} catch (error) {
				if (error instanceof Error) {
					if (
						error.message === "Album link not found" ||
						error.message === "Album link is deactivated" ||
						error.message === "Album link has expired" ||
						error.message === "Rating must be between 1 and 5"
					) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: error.message,
						});
					}
				}

				console.error("Submit feedback error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to submit feedback",
				});
			}
		}),

	/**
	 * Get feedback by album (protected)
	 */
	getByAlbum: protectedProcedure
		.input(getFeedbackByAlbumSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const feedback = await feedbackService.getFeedbackByAlbum(
					userId,
					input.albumId,
				);

				return {
					feedback,
					total: feedback.length,
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

				console.error("Get feedback error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch feedback",
				});
			}
		}),

	/**
	 * Get feedback statistics (protected)
	 */
	getStats: protectedProcedure
		.input(getFeedbackStatsSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const stats = await feedbackService.getFeedbackStats(
					userId,
					input.albumId,
				);

				return stats;
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Album not found or unauthorized") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: error.message,
						});
					}
				}

				console.error("Get feedback stats error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch feedback stats",
				});
			}
		}),
});

export type FeedbackRouter = typeof feedbackRouter;
