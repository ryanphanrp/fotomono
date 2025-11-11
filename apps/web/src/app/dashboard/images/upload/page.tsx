"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/images/ImageUpload";
import { trpc } from "@/lib/trpc";

export default function UploadImagesPage() {
	const [selectedShowId, setSelectedShowId] = useState<string>("");

	const { data: shows } = trpc.shows.list.useQuery({});

	const handleUploadComplete = (results: unknown[]) => {
		console.log("Upload complete:", results);
		// Optionally redirect or show success message
		alert(`${results.length} images uploaded successfully!`);
	};

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<h1 className="text-3xl font-bold mb-6">Upload Images</h1>

			<div className="space-y-6">
				{/* Show Selection */}
				<div className="bg-white p-6 rounded-lg shadow">
					<label className="block text-sm font-medium mb-2">
						Select Show/Session
					</label>
					<select
						value={selectedShowId}
						onChange={(e) => setSelectedShowId(e.target.value)}
						className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Choose a show...</option>
						{shows?.shows.map((show) => (
							<option key={show.id} value={show.id}>
								{show.title} - {show.clientName} (
								{new Date(show.dateStart).toLocaleDateString()})
							</option>
						))}
					</select>
				</div>

				{/* Upload Component */}
				<div className="bg-white p-6 rounded-lg shadow">
					{selectedShowId ? (
						<ImageUpload
							showId={selectedShowId}
							onUploadComplete={handleUploadComplete}
							maxFiles={50}
							maxSize={50}
						/>
					) : (
						<div className="text-center py-12 text-gray-500">
							<p>Please select a show first</p>
						</div>
					)}
				</div>

				{/* Instructions */}
				<div className="bg-blue-50 p-4 rounded border border-blue-200">
					<h3 className="font-medium text-blue-900 mb-2">Upload Tips</h3>
					<ul className="text-sm text-blue-800 space-y-1">
						<li>• Supported formats: JPEG, PNG, WEBP, HEIC</li>
						<li>• Maximum file size: 50MB per image</li>
						<li>• You can upload up to 50 images at once</li>
						<li>• Images will be automatically optimized and thumbnails generated</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
