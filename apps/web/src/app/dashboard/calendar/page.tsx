import type { Metadata } from "next";
import CalendarView from "@/components/calendar-view";

export const metadata: Metadata = {
  title: "Calendar | Dashboard",
  description: "View your photography sessions in a calendar",
};

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-2 font-bold text-3xl">Calendar</h1>
        <p className="text-gray-600">
          View and manage your photography sessions by date
        </p>
      </div>
      <CalendarView />
    </div>
  );
}
