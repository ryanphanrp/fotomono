"use client";

import { useRouter } from "next/navigation";
import ShowForm from "@/components/show-form";

export default function NewShowPage() {
	const router = useRouter();

	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<div className="mb-6">
				<button
					onClick={() => router.back()}
					className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
				>
					← Back to Shows
				</button>
				<h1 className="text-3xl font-bold mb-2">Create New Show</h1>
				<p className="text-gray-600">Schedule a new photography session with client details</p>
			</div>
			<ShowForm
				onSuccess={() => router.push("/dashboard/shows")}
				onCancel={() => router.back()}
			/>
		</div>
	);
}
