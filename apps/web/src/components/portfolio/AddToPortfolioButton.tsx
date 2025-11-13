"use client";

import { useState } from "react";

interface AddToPortfolioButtonProps {
	selectedImageIds: string[];
	onSuccess?: () => void;
}

export function AddToPortfolioButton({
	selectedImageIds,
	onSuccess,
}: AddToPortfolioButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [category, setCategory] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// TODO: Use tRPC mutation
	// const addToPortfolio = trpc.portfolio.addImage.useMutation();

	const handleAddTag = () => {
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			setTags([...tags, tagInput.trim()]);
			setTagInput("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleSubmit = async () => {
		if (selectedImageIds.length === 0) return;

		setIsSubmitting(true);
		try {
			// TODO: Implement batch add to portfolio
			// for (const imageId of selectedImageIds) {
			//   await addToPortfolio.mutateAsync({
			//     imageId,
			//     category: category || undefined,
			//     tags: tags.length > 0 ? tags : undefined,
			//   });
			// }

			setIsOpen(false);
			setCategory("");
			setTags([]);
			onSuccess?.();
		} catch (error) {
			console.error("Failed to add to portfolio:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (selectedImageIds.length === 0) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
			>
				Add to Portfolio ({selectedImageIds.length})
			</button>

			{/* Modal */}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b">
							<h2 className="text-xl font-semibold">Add to Portfolio</h2>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>

						{/* Body */}
						<div className="p-6 space-y-4">
							<div>
								<p className="text-sm text-gray-600 mb-4">
									Adding {selectedImageIds.length} image
									{selectedImageIds.length > 1 ? "s" : ""} to your portfolio
								</p>

								{/* Category */}
								<div>
									<label
										htmlFor="category"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Category (optional)
									</label>
									<input
										id="category"
										type="text"
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										placeholder="e.g., Weddings, Portraits, Landscape"
										className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								{/* Tags */}
								<div>
									<label
										htmlFor="tags"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Tags (optional)
									</label>
									<div className="flex gap-2">
										<input
											id="tags"
											type="text"
											value={tagInput}
											onChange={(e) => setTagInput(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleAddTag();
												}
											}}
											placeholder="Add a tag..."
											className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
										<button
											type="button"
											onClick={handleAddTag}
											className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
										>
											Add
										</button>
									</div>

									{/* Tag List */}
									{tags.length > 0 && (
										<div className="flex flex-wrap gap-2 mt-2">
											{tags.map((tag) => (
												<span
													key={tag}
													className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded flex items-center gap-1"
												>
													{tag}
													<button
														type="button"
														onClick={() => handleRemoveTag(tag)}
														className="hover:text-blue-900"
													>
														✕
													</button>
												</span>
											))}
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-end gap-2 p-6 border-t">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								disabled={isSubmitting}
								className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
							>
								{isSubmitting ? "Adding..." : "Add to Portfolio"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
