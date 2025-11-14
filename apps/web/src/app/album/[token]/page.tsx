"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function PublicAlbumPage() {
	const params = useParams();
	const token = params.token as string;

	const [selectedImage, setSelectedImage] = useState<number | null>(null);
	const [showFeedbackForm, setShowFeedbackForm] = useState(false);
	const [rating, setRating] = useState(0);
	const [feedbackText, setFeedbackText] = useState("");
	const [clientName, setClientName] = useState("");
	const [clientEmail, setClientEmail] = useState("");
	const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

	// TODO: Fetch album by token
	// const { data, isLoading, error } = trpc.albumLinks.getByToken.useQuery({ token });

	const album = {
		name: "Sample Album",
		description: "Sample description",
		images: [],
		allowDownload: true,
	};

	const images: Array<{
		imageId: string;
		filename: string;
		url: string;
		thumbnailMediumUrl: string;
		width: number;
		height: number;
	}> = [];

	const handleDownloadImage = (imageId: string) => {
		// TODO: Get download URL
		console.log("Download image:", imageId);
	};

	const handleDownloadAll = () => {
		// TODO: Download all as ZIP
		console.log("Download all");
	};

	const handleSubmitFeedback = async () => {
		// TODO: Submit feedback
		setFeedbackSubmitted(true);
		setTimeout(() => setShowFeedbackForm(false), 2000);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b">
				<div className="container mx-auto px-4 py-6">
					<h1 className="text-3xl font-bold mb-2">{album.name}</h1>
					{album.description && (
						<p className="text-gray-600">{album.description}</p>
					)}
					<div className="flex items-center gap-4 mt-4">
						<span className="text-sm text-gray-500">
							{images.length} photos
						</span>
						{album.allowDownload && (
							<>
								<button
									type="button"
									onClick={handleDownloadAll}
									className="text-sm text-blue-600 hover:underline"
								>
									Download All
								</button>
								<button
									type="button"
									onClick={() => setShowFeedbackForm(true)}
									className="text-sm text-blue-600 hover:underline"
								>
									Leave Feedback
								</button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Gallery */}
			<div className="container mx-auto px-4 py-8">
				{images.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{images.map((image, index) => (
							<div
								key={image.imageId}
								onClick={() => setSelectedImage(index)}
								className="relative aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
							>
								<Image
									src={image.thumbnailMediumUrl}
									alt={image.filename}
									fill
									className="object-cover"
									sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
								/>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-12 bg-white rounded-lg">
						<p className="text-gray-600">No photos in this album</p>
					</div>
				)}
			</div>

			{/* Lightbox */}
			{selectedImage !== null && images[selectedImage] && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
					<button
						type="button"
						onClick={() => setSelectedImage(null)}
						className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
					>
						×
					</button>

					{/* Navigation */}
					{selectedImage > 0 && (
						<button
							type="button"
							onClick={() => setSelectedImage(selectedImage - 1)}
							className="absolute left-4 text-white text-4xl hover:text-gray-300"
						>
							‹
						</button>
					)}
					{selectedImage < images.length - 1 && (
						<button
							type="button"
							onClick={() => setSelectedImage(selectedImage + 1)}
							className="absolute right-4 text-white text-4xl hover:text-gray-300"
						>
							›
						</button>
					)}

					{/* Image */}
					<div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8">
						<Image
							src={images[selectedImage].url}
							alt={images[selectedImage].filename}
							fill
							className="object-contain"
							sizes="100vw"
						/>
					</div>

					{/* Bottom Bar */}
					<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
						<div className="container mx-auto flex items-center justify-between">
							<span className="text-sm">
								{selectedImage + 1} / {images.length}
							</span>
							{album.allowDownload && (
								<button
									type="button"
									onClick={() =>
										handleDownloadImage(images[selectedImage].imageId)
									}
									className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
								>
									Download
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Feedback Modal */}
			{showFeedbackForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
						<div className="flex items-center justify-between p-6 border-b">
							<h2 className="text-xl font-semibold">Leave Feedback</h2>
							<button
								type="button"
								onClick={() => setShowFeedbackForm(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>

						<div className="p-6 space-y-4">
							{!feedbackSubmitted ? (
								<>
									{/* Rating */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Rate your experience
										</label>
										<div className="flex gap-2">
											{[1, 2, 3, 4, 5].map((star) => (
												<button
													key={star}
													type="button"
													onClick={() => setRating(star)}
													className="text-3xl focus:outline-none"
												>
													{star <= rating ? "★" : "☆"}
												</button>
											))}
										</div>
									</div>

									{/* Feedback Text */}
									<div>
										<label
											htmlFor="feedback"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Comments (optional)
										</label>
										<textarea
											id="feedback"
											value={feedbackText}
											onChange={(e) => setFeedbackText(e.target.value)}
											placeholder="Share your thoughts..."
											rows={4}
											className="w-full border rounded px-3 py-2"
										/>
									</div>

									{/* Client Info */}
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Your Name (optional)
										</label>
										<input
											id="name"
											type="text"
											value={clientName}
											onChange={(e) => setClientName(e.target.value)}
											placeholder="Your name"
											className="w-full border rounded px-3 py-2"
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Your Email (optional)
										</label>
										<input
											id="email"
											type="email"
											value={clientEmail}
											onChange={(e) => setClientEmail(e.target.value)}
											placeholder="your@email.com"
											className="w-full border rounded px-3 py-2"
										/>
									</div>
								</>
							) : (
								<div className="bg-green-50 border border-green-200 rounded p-4 text-center">
									<p className="text-green-800 font-medium">
										Thank you for your feedback!
									</p>
								</div>
							)}
						</div>

						{!feedbackSubmitted && (
							<div className="flex items-center justify-end gap-2 p-6 border-t">
								<button
									type="button"
									onClick={() => setShowFeedbackForm(false)}
									className="px-4 py-2 border rounded hover:bg-gray-50"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleSubmitFeedback}
									className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
								>
									Submit Feedback
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
