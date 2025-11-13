"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface ApprovalImage {
	id: string;
	imageId: string;
	filename: string;
	thumbnailMediumUrl: string;
	url: string;
	status: "pending" | "approved" | "rejected";
	clientFeedback: string | null;
}

export default function ApprovalPage() {
	const params = useParams();
	const token = params.token as string;

	const [images, setImages] = useState<ApprovalImage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedImage, setSelectedImage] = useState<ApprovalImage | null>(
		null,
	);
	const [feedback, setFeedback] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// TODO: Fetch images using tRPC
	// useEffect(() => {
	//   const fetchImages = async () => {
	//     try {
	//       const result = await trpc.approval.getByToken.query({ token });
	//       setImages(result.images);
	//     } catch (err) {
	//       setError(err.message);
	//     } finally {
	//       setIsLoading(false);
	//     }
	//   };
	//   fetchImages();
	// }, [token]);

	const handleApprove = async (imageId: string) => {
		setIsSubmitting(true);
		try {
			// TODO: Implement approve
			// await trpc.approval.approve.mutate({
			//   token,
			//   imageId,
			//   feedback: feedback || undefined,
			// });

			setImages(
				images.map((img) =>
					img.imageId === imageId ? { ...img, status: "approved" } : img,
				),
			);
			setSelectedImage(null);
			setFeedback("");
		} catch (err) {
			console.error("Failed to approve:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReject = async (imageId: string) => {
		setIsSubmitting(true);
		try {
			// TODO: Implement reject
			// await trpc.approval.reject.mutate({
			//   token,
			//   imageId,
			//   feedback: feedback || undefined,
			// });

			setImages(
				images.map((img) =>
					img.imageId === imageId ? { ...img, status: "rejected" } : img,
				),
			);
			setSelectedImage(null);
			setFeedback("");
		} catch (err) {
			console.error("Failed to reject:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
					<p className="text-gray-600">Loading images...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center max-w-md">
					<svg
						className="mx-auto h-16 w-16 text-red-500 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Error</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Unable to load images
					</h2>
					<p className="text-gray-600">{error}</p>
				</div>
			</div>
		);
	}

	const pendingCount = images.filter((img) => img.status === "pending").length;
	const approvedCount = images.filter((img) => img.status === "approved")
		.length;
	const rejectedCount = images.filter((img) => img.status === "rejected")
		.length;

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-7xl">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Image Approval
					</h1>
					<p className="text-gray-600 mb-4">
						Please review the images below and approve or reject each one.
					</p>

					{/* Stats */}
					<div className="flex gap-4 text-sm">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full bg-yellow-400" />
							<span>Pending: {pendingCount}</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full bg-green-500" />
							<span>Approved: {approvedCount}</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full bg-red-500" />
							<span>Rejected: {rejectedCount}</span>
						</div>
					</div>
				</div>

				{/* Image Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{images.map((image) => (
						<div
							key={image.id}
							className="bg-white rounded-lg shadow-sm overflow-hidden"
						>
							{/* Image */}
							<div className="relative aspect-square bg-gray-100">
								<Image
									src={image.thumbnailMediumUrl}
									alt={image.filename}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
								/>

								{/* Status Badge */}
								{image.status !== "pending" && (
									<div className="absolute top-2 right-2">
										{image.status === "approved" ? (
											<span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
												✓ Approved
											</span>
										) : (
											<span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
												✕ Rejected
											</span>
										)}
									</div>
								)}
							</div>

							{/* Actions */}
							<div className="p-4">
								<p className="text-sm text-gray-600 mb-3 truncate">
									{image.filename}
								</p>

								{image.status === "pending" ? (
									<div className="flex gap-2">
										<button
											type="button"
											onClick={() => setSelectedImage(image)}
											className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
										>
											Approve
										</button>
										<button
											type="button"
											onClick={() => setSelectedImage(image)}
											className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
										>
											Reject
										</button>
									</div>
								) : (
									<div className="text-center py-2">
										<span className="text-sm text-gray-500">
											{image.status === "approved" ? "✓ Approved" : "✕ Rejected"}
										</span>
										{image.clientFeedback && (
											<p className="text-xs text-gray-400 mt-1 italic">
												"{image.clientFeedback}"
											</p>
										)}
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{images.length === 0 && (
					<div className="bg-white rounded-lg shadow-sm p-12 text-center">
						<p className="text-gray-600">No images to review</p>
					</div>
				)}

				{/* Completion Message */}
				{pendingCount === 0 && images.length > 0 && (
					<div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
						<svg
							className="mx-auto h-12 w-12 text-green-600 mb-3"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>Complete</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<h3 className="text-lg font-semibold text-green-900 mb-1">
							All images reviewed!
						</h3>
						<p className="text-green-700">
							Thank you for your feedback. You can close this page now.
						</p>
					</div>
				)}
			</div>

			{/* Decision Modal */}
			{selectedImage && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						{/* Header */}
						<div className="p-6 border-b">
							<h2 className="text-xl font-semibold">
								{selectedImage.filename}
							</h2>
						</div>

						{/* Image Preview */}
						<div className="p-6">
							<div className="relative aspect-video bg-gray-100 rounded mb-4">
								<Image
									src={selectedImage.url}
									alt={selectedImage.filename}
									fill
									className="object-contain"
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
							</div>

							{/* Feedback */}
							<div className="mb-4">
								<label
									htmlFor="feedback"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Feedback (optional)
								</label>
								<textarea
									id="feedback"
									value={feedback}
									onChange={(e) => setFeedback(e.target.value)}
									placeholder="Add any comments or suggestions..."
									rows={3}
									className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-end gap-2 p-6 border-t">
							<button
								type="button"
								onClick={() => {
									setSelectedImage(null);
									setFeedback("");
								}}
								disabled={isSubmitting}
								className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => handleReject(selectedImage.imageId)}
								disabled={isSubmitting}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
							>
								{isSubmitting ? "Rejecting..." : "Reject"}
							</button>
							<button
								type="button"
								onClick={() => handleApprove(selectedImage.imageId)}
								disabled={isSubmitting}
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
							>
								{isSubmitting ? "Approving..." : "Approve"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
