import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../index";
import {
	createShowSchema,
	updateShowSchema,
	updateShowStatusSchema,
	listShowsSchema,
	calendarViewSchema,
	getShowByIdSchema,
	deleteShowSchema,
} from "../schemas/show";
import { db } from "@fotomono/db";
import { show } from "@fotomono/db/schema/shows";
import { eq, and, gte, lte, or, like, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { scheduleShowReminders, rescheduleShowReminders } from "../utils/reminders";

/**
 * Shows router
 * Handles photography show/session management
 */
export const showsRouter = router({
	/**
	 * Create a new show
	 */
	create: protectedProcedure
		.input(createShowSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Validate date range
				if (input.dateEnd < input.dateStart) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "End date must be after start date",
					});
				}

				// Create show
				const newShow = await db.insert(show).values({
					id: nanoid(),
					userId,
					title: input.title,
					clientName: input.clientName,
					clientEmail: input.clientEmail || null,
					clientPhone: input.clientPhone || null,
					shootType: input.shootType,
					location: input.location || null,
					dateStart: input.dateStart,
					dateEnd: input.dateEnd,
					pricing: input.pricing?.toString() || null,
					currency: input.currency || "USD",
					status: "pending",
					notes: input.notes || null,
					createdAt: new Date(),
					updatedAt: new Date(),
				}).returning();

				// Schedule reminders for the show
				await scheduleShowReminders(newShow[0].id, input.dateStart);

				return {
					success: true,
					message: "Show created successfully",
					show: newShow[0],
				};
			} catch (error) {
				console.error("Create show error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create show",
				});
			}
		}),

	/**
	 * List shows with filters
	 */
	list: protectedProcedure
		.input(listShowsSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Build where conditions
				const conditions = [eq(show.userId, userId)];

				if (input.status) {
					conditions.push(eq(show.status, input.status));
				}

				if (input.shootType) {
					conditions.push(eq(show.shootType, input.shootType));
				}

				if (input.dateFrom) {
					conditions.push(gte(show.dateStart, input.dateFrom));
				}

				if (input.dateTo) {
					conditions.push(lte(show.dateEnd, input.dateTo));
				}

				if (input.search) {
					conditions.push(
						or(
							like(show.title, `%${input.search}%`),
							like(show.clientName, `%${input.search}%`),
						),
					);
				}

				// Query shows
				const shows = await db
					.select()
					.from(show)
					.where(and(...conditions))
					.orderBy(desc(show.dateStart))
					.limit(input.limit || 50)
					.offset(input.offset || 0);

				return {
					shows,
					total: shows.length,
				};
			} catch (error) {
				console.error("List shows error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch shows",
				});
			}
		}),

	/**
	 * Get show by ID
	 */
	getById: protectedProcedure
		.input(getShowByIdSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				const foundShow = await db
					.select()
					.from(show)
					.where(and(eq(show.id, input.id), eq(show.userId, userId)))
					.limit(1);

				if (!foundShow || foundShow.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Show not found",
					});
				}

				return foundShow[0];
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Get show error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch show",
				});
			}
		}),

	/**
	 * Update show
	 */
	update: protectedProcedure
		.input(updateShowSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Check if show exists and belongs to user
				const existingShow = await db
					.select()
					.from(show)
					.where(and(eq(show.id, input.id), eq(show.userId, userId)))
					.limit(1);

				if (!existingShow || existingShow.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Show not found",
					});
				}

				// Validate date range if both dates provided
				if (input.dateStart && input.dateEnd && input.dateEnd < input.dateStart) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "End date must be after start date",
					});
				}

				// Build update object (only include provided fields)
				const updateData: any = {
					updatedAt: new Date(),
				};

				if (input.title !== undefined) updateData.title = input.title;
				if (input.clientName !== undefined) updateData.clientName = input.clientName;
				if (input.clientEmail !== undefined)
					updateData.clientEmail = input.clientEmail || null;
				if (input.clientPhone !== undefined)
					updateData.clientPhone = input.clientPhone || null;
				if (input.shootType !== undefined) updateData.shootType = input.shootType;
				if (input.location !== undefined) updateData.location = input.location || null;
				if (input.dateStart !== undefined) updateData.dateStart = input.dateStart;
				if (input.dateEnd !== undefined) updateData.dateEnd = input.dateEnd;
				if (input.pricing !== undefined)
					updateData.pricing = input.pricing?.toString() || null;
				if (input.currency !== undefined) updateData.currency = input.currency;
				if (input.notes !== undefined) updateData.notes = input.notes || null;

				// Update show
				const updatedShow = await db
					.update(show)
					.set(updateData)
					.where(and(eq(show.id, input.id), eq(show.userId, userId)))
					.returning();

				// Reschedule reminders if the start date changed
				if (input.dateStart !== undefined) {
					await rescheduleShowReminders(input.id, input.dateStart);
				}

				return {
					success: true,
					message: "Show updated successfully",
					show: updatedShow[0],
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Update show error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update show",
				});
			}
		}),

	/**
	 * Update show status
	 */
	updateStatus: protectedProcedure
		.input(updateShowStatusSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Check if show exists and belongs to user
				const existingShow = await db
					.select()
					.from(show)
					.where(and(eq(show.id, input.id), eq(show.userId, userId)))
					.limit(1);

				if (!existingShow || existingShow.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Show not found",
					});
				}

				// Update status
				const updatedShow = await db
					.update(show)
					.set({
						status: input.status,
						updatedAt: new Date(),
					})
					.where(and(eq(show.id, input.id), eq(show.userId, userId)))
					.returning();

				return {
					success: true,
					message: `Show status updated to ${input.status}`,
					show: updatedShow[0],
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Update status error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update show status",
				});
			}
		}),

	/**
	 * Delete show
	 */
	delete: protectedProcedure
		.input(deleteShowSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Check if show exists and belongs to user
				const existingShow = await db
					.select()
					.from(show)
					.where(and(eq(show.id, input.id), eq(show.userId, userId)))
					.limit(1);

				if (!existingShow || existingShow.length === 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Show not found",
					});
				}

				// Delete show (cascade will delete related data)
				await db
					.delete(show)
					.where(and(eq(show.id, input.id), eq(show.userId, userId)));

				return {
					success: true,
					message: "Show deleted successfully",
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				console.error("Delete show error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete show",
				});
			}
		}),

	/**
	 * Get calendar view data
	 */
	calendar: protectedProcedure
		.input(calendarViewSchema)
		.query(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;

				// Calculate date range based on view
				const startDate = new Date(input.year, input.month - 1, 1);
				const endDate = new Date(input.year, input.month, 0, 23, 59, 59);

				// Fetch shows in date range
				const shows = await db
					.select()
					.from(show)
					.where(
						and(
							eq(show.userId, userId),
							gte(show.dateStart, startDate),
							lte(show.dateStart, endDate),
						),
					)
					.orderBy(show.dateStart);

				// Format for calendar display
				const events = shows.map((s) => ({
					id: s.id,
					title: s.title,
					start: s.dateStart,
					end: s.dateEnd,
					status: s.status,
					shootType: s.shootType,
					clientName: s.clientName,
					location: s.location,
				}));

				return {
					events,
					total: events.length,
				};
			} catch (error) {
				console.error("Calendar view error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch calendar data",
				});
			}
		}),
});

export type ShowsRouter = typeof showsRouter;
