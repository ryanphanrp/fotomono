"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Gallery } from "@/components/images/Gallery";
import { trpc } from "@/lib/trpc";

type FilterType = "all" | "portfolio" | "archived";

export default function ShowImagesPage() {
	const params = useParams();
	const showId = params.id as string;

	const [filter, setFilter] = useState<FilterType>("all");
	const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

	const { data: imagesData, refetch } = trpc.images.getByShow.useQuery({
		showId,
		filter,
	});

	const bulkUpdate = trpc.images.bulkUpdate.useMutation({
		onSuccess: () => {
			refetch();
			setSelectedImageIds([]);
		},
	});

	const handleBulkAction = async (operation: string) => {
		if (selectedImageIds.length === 0) return;

		try {
			await bulkUpdate.mutateAsync({
				imageIds: selectedImageIds,
				operation: operation as never,
			});
			alert("Images updated successfully");
		} catch (error) {
			alert("Failed to update images");
		}
	};

	return (
		<div className="container mx-auto p-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Show Images</h1>
				<p className="text-gray-600 mt-1">
					{imagesData?.total || 0} images total
				</p>
			</div>

			{/* Filters */}
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setFilter("all")}
						className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
					>
						All
					</button>
					<button
						type="button"
						onClick={() => setFilter("portfolio")}
						className={`px-4 py-2 rounded ${filter === "portfolio" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
					>
						Portfolio
					</button>
					<button
						type="button"
						onClick={() => setFilter("archived")}
						className={`px-4 py-2 rounded ${filter === "archived" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
					>
						Archived
					</button>
				</div>

				{/* Bulk Actions */}
				{selectedImageIds.length > 0 && (
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => handleBulkAction("mark_portfolio")}
							className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
						>
							Mark Portfolio
						</button>
						<button
							type="button"
							onClick={() => handleBulkAction("archive")}
							className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
						>
							Archive
						</button>
						<button
							type="button"
							onClick={() => handleBulkAction("delete")}
							className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
						>
							Delete
						</button>
					</div>
				)}
			</div>

			{/* Gallery */}
			<Gallery
				images={imagesData?.images || []}
				selectable
				onBulkSelect={setSelectedImageIds}
			/>
		</div>
	);
}
