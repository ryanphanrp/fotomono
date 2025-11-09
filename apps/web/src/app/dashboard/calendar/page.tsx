import { Metadata } from "next";
import CalendarView from "@/components/calendar-view";

export const metadata: Metadata = {
	title: "Calendar | Dashboard",
	description: "View your photography sessions in a calendar",
};

export default function CalendarPage() {
	return (
		<div className="container mx-auto py-8 px-4">
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">Calendar</h1>
				<p className="text-gray-600">View and manage your photography sessions by date</p>
			</div>
			<CalendarView />
		</div>
	);
}
