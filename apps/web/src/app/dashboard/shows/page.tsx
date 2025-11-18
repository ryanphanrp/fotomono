import type { Metadata } from "next";
import ShowList from "@/components/show-list";

export const metadata: Metadata = {
  title: "Shows | Dashboard",
  description: "Manage your photography sessions and bookings",
};

export default function ShowsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-2 font-bold text-3xl">Shows Management</h1>
        <p className="text-gray-600">
          View, manage, and schedule your photography sessions
        </p>
      </div>
      <ShowList />
    </div>
  );
}
