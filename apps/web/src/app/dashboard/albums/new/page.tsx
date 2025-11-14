"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewAlbumPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedShowId, setSelectedShowId] = useState("");
	const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// TODO: Fetch shows
	// const { data: showsData } = trpc.shows.list.useQuery();
	const shows: Array<{ id: string; name: string }> = [];

	// TODO: Fetch images for selected show
	// const { data: imagesData } = trpc.images.getByShow.useQuery(
	//   { showId: selectedShowId },
	//   { enabled: !!selectedShowId }
	// );
	const images: Array<{
		id: string;
		filename: string;
		thumbnailSmallUrl: string;
	}> = [];

	const handleImageToggle = (imageId: string) => {
		setSelectedImageIds((prev) =>
			prev.includes(imageId)
				? prev.filter((id) => id !== imageId)
				: [...prev, imageId],
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !selectedShowId) {
			alert("Please provide album name and select a show");
			return;
		}

		setIsSubmitting(true);
		try {
			// TODO: Create album
			// const result = await createAlbum.mutateAsync({
			//   name,
			//   description,
			//   showId: selectedShowId,
			//   imageIds: selectedImageIds,
			// });

			// router.push(`/dashboard/albums/${result.album.id}`);
		} catch (error) {
			console.error("Failed to create album:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Create New Album</h1>
				<p className="text-gray-600 mt-1">
					Create a curated collection of photos to share with clients
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Album Details */}
				<div className="bg-white rounded-lg border p-6 space-y-4">
					<h2 className="text-xl font-semibold">Album Details</h2>

					{/* Name */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Album Name *
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., Sarah & John - Wedding Selection"
							required
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Description (optional)
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add a description for this album..."
							rows={3}
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Show Selection */}
					<div>
						<label
							htmlFor="show"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Select Show *
						</label>
						<select
							id="show"
							value={selectedShowId}
							onChange={(e) => setSelectedShowId(e.target.value)}
							required
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Choose a show...</option>
							{shows.map((show) => (
								<option key={show.id} value={show.id}>
									{show.name}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Image Selection */}
				{selectedShowId && (
					<div className="bg-white rounded-lg border p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold">Select Images</h2>
							<span className="text-sm text-gray-600">
								{selectedImageIds.length} selected
							</span>
						</div>

						{images.length > 0 ? (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
								{images.map((image) => (
									<div
										key={image.id}
										onClick={() => handleImageToggle(image.id)}
										className={`relative aspect-square cursor-pointer rounded border-2 overflow-hidden ${
											selectedImageIds.includes(image.id)
												? "border-blue-500 ring-2 ring-blue-500"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<Image
											src={image.thumbnailSmallUrl}
											alt={image.filename}
											fill
											className="object-cover"
											sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
										/>
										{selectedImageIds.includes(image.id) && (
											<div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
												<svg
													className="w-4 h-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<title>Selected</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={3}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<p className="text-center text-gray-500 py-8">
								No images found in this show
							</p>
						)}
					</div>
				)}

				{/* Actions */}
				<div className="flex items-center justify-end gap-3">
					<button
						type="button"
						onClick={() => router.back()}
						disabled={isSubmitting}
						className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting || !name || !selectedShowId}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
					>
						{isSubmitting ? "Creating..." : "Create Album"}
					</button>
				</div>
			</form>
		</div>
	);
}
