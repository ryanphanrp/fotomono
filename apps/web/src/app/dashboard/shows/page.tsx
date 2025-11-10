import { Metadata } from "next";
import ShowList from "@/components/show-list";

export const metadata: Metadata = {
	title: "Shows | Dashboard",
	description: "Manage your photography sessions and bookings",
};

export default function ShowsPage() {
	return (
		<div className="container mx-auto py-8 px-4">
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">Shows Management</h1>
				<p className="text-gray-600">
					View, manage, and schedule your photography sessions
				</p>
			</div>
			<ShowList />
		</div>
	);
}
