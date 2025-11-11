import { db } from "@fotomono/db";
import { showReminder } from "@fotomono/db/schema/shows";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Reminder trigger types
 */
export type ReminderTriggerType = "1_day_before" | "1_hour_before" | "custom";

/**
 * Schedule reminders for a show
 * Creates reminder records for 1 day before and 1 hour before the show start time
 *
 * @param showId - The ID of the show to schedule reminders for
 * @param showStartDate - The start date of the show
 * @returns Array of created reminder records
 */
export async function scheduleShowReminders(
	showId: string,
	showStartDate: Date,
): Promise<void> {
	// Calculate trigger times
	const oneDayBefore = new Date(showStartDate);
	oneDayBefore.setDate(oneDayBefore.getDate() - 1);

	const oneHourBefore = new Date(showStartDate);
	oneHourBefore.setHours(oneHourBefore.getHours() - 1);

	// Create reminder records
	const reminders = [
		{
			id: nanoid(),
			showId,
			triggerType: "1_day_before" as ReminderTriggerType,
			triggerTime: oneDayBefore,
			sent: false,
			sentAt: null,
			createdAt: new Date(),
		},
		{
			id: nanoid(),
			showId,
			triggerType: "1_hour_before" as ReminderTriggerType,
			triggerTime: oneHourBefore,
			sent: false,
			sentAt: null,
			createdAt: new Date(),
		},
	];

	// Insert reminders into database
	await db.insert(showReminder).values(reminders);
}

/**
 * Delete all reminders for a show
 * Useful when a show is deleted or rescheduled
 *
 * @param showId - The ID of the show
 */
export async function deleteShowReminders(showId: string): Promise<void> {
	await db.delete(showReminder).where(eq(showReminder.showId, showId));
}

/**
 * Reschedule reminders for a show
 * Deletes existing reminders and creates new ones based on the new start date
 *
 * @param showId - The ID of the show
 * @param newStartDate - The new start date
 */
export async function rescheduleShowReminders(
	showId: string,
	newStartDate: Date,
): Promise<void> {
	// Delete existing reminders
	await deleteShowReminders(showId);

	// Create new reminders
	await scheduleShowReminders(showId, newStartDate);
}
