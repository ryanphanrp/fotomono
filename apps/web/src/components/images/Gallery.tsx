"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
	id: string;
	filename: string;
	thumbnailMediumUrl: string;
	originalUrl: string;
	isPortfolio: boolean;
	isArchived: boolean;
	tags: string[] | null;
	category: string | null;
}

interface GalleryProps {
	images: GalleryImage[];
	onSelectImage?: (imageId: string) => void;
	onBulkSelect?: (imageIds: string[]) => void;
	selectable?: boolean;
}

export function Gallery({
	images,
	onSelectImage,
	onBulkSelect,
	selectable = false,
}: GalleryProps) {
	const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
	const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

	const toggleSelection = (imageId: string) => {
		const newSelected = new Set(selectedImages);
		if (newSelected.has(imageId)) {
			newSelected.delete(imageId);
		} else {
			newSelected.add(imageId);
		}
		setSelectedImages(newSelected);
		onBulkSelect?.(Array.from(newSelected));
	};

	const selectAll = () => {
		const allIds = images.map((img) => img.id);
		setSelectedImages(new Set(allIds));
		onBulkSelect?.(allIds);
	};

	const clearSelection = () => {
		setSelectedImages(new Set());
		onBulkSelect?.([]);
	};

	return (
		<div className="space-y-4">
			{/* Toolbar */}
			{selectable && selectedImages.size > 0 && (
				<div className="flex items-center justify-between p-4 bg-blue-50 rounded border border-blue-200">
					<span className="text-sm font-medium">
						{selectedImages.size} image(s) selected
					</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={selectAll}
							className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
						>
							Select All
						</button>
						<button
							type="button"
							onClick={clearSelection}
							className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
						>
							Clear
						</button>
					</div>
				</div>
			)}

			{/* Gallery Grid */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{images.map((image) => (
					<div
						key={image.id}
						className={`
							relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
							${selectedImages.has(image.id) ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-gray-300"}
						`}
						onClick={() => {
							if (selectable) {
								toggleSelection(image.id);
							} else {
								setLightboxImage(image);
							}
						}}
					>
						{/* Image */}
						<div className="aspect-square relative bg-gray-100">
							<Image
								src={image.thumbnailMediumUrl}
								alt={image.filename}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
							/>
						</div>

						{/* Overlay */}
						<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />

						{/* Badges */}
						<div className="absolute top-2 right-2 flex flex-col gap-1">
							{image.isPortfolio && (
								<span className="px-2 py-1 text-xs bg-green-500 text-white rounded">
									Portfolio
								</span>
							)}
							{image.isArchived && (
								<span className="px-2 py-1 text-xs bg-gray-500 text-white rounded">
									Archived
								</span>
							)}
						</div>

						{/* Selection Checkbox */}
						{selectable && (
							<div className="absolute top-2 left-2">
								<input
									type="checkbox"
									checked={selectedImages.has(image.id)}
									onChange={() => toggleSelection(image.id)}
									className="w-5 h-5 rounded"
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
						)}

						{/* Filename */}
						<div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
							<p className="text-white text-xs truncate">{image.filename}</p>
						</div>
					</div>
				))}
			</div>

			{/* Empty State */}
			{images.length === 0 && (
				<div className="text-center py-12 text-gray-500">
					<svg
						className="mx-auto h-12 w-12 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>No Images</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<p>No images found</p>
				</div>
			)}

			{/* Lightbox Modal */}
			{lightboxImage && (
				<div
					className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
					onClick={() => setLightboxImage(null)}
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
						onClick={() => setLightboxImage(null)}
					>
						✕
					</button>
					<div className="relative max-w-7xl max-h-full">
						<Image
							src={lightboxImage.originalUrl}
							alt={lightboxImage.filename}
							width={1920}
							height={1080}
							className="max-h-[90vh] w-auto object-contain"
						/>
						<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
							<p className="text-white font-medium">{lightboxImage.filename}</p>
							{lightboxImage.tags && lightboxImage.tags.length > 0 && (
								<div className="flex flex-wrap gap-1 mt-2">
									{lightboxImage.tags.map((tag) => (
										<span
											key={tag}
											className="px-2 py-1 text-xs bg-gray-700 text-white rounded"
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
