"use client";

import { useState } from "react";

interface CreateApprovalLinkProps {
	selectedImageIds: string[];
	onSuccess?: () => void;
}

export function CreateApprovalLink({
	selectedImageIds,
	onSuccess,
}: CreateApprovalLinkProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [expiresInDays, setExpiresInDays] = useState(7);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [approvalLink, setApprovalLink] = useState<string | null>(null);
	const [expiresAt, setExpiresAt] = useState<Date | null>(null);
	const [copied, setCopied] = useState(false);

	// TODO: Use tRPC mutation
	// const createLink = trpc.approval.createLink.useMutation();

	const handleSubmit = async () => {
		if (selectedImageIds.length === 0) return;

		setIsSubmitting(true);
		try {
			// TODO: Implement create approval link
			// const result = await createLink.mutateAsync({
			//   imageIds: selectedImageIds,
			//   expiresInDays,
			// });

			// Generate mock link for now
			const mockToken = "mock_token_" + Date.now();
			const mockExpiresAt = new Date();
			mockExpiresAt.setDate(mockExpiresAt.getDate() + expiresInDays);

			const baseUrl =
				typeof window !== "undefined" ? window.location.origin : "";
			setApprovalLink(`${baseUrl}/approval/${mockToken}`);
			setExpiresAt(mockExpiresAt);

			onSuccess?.();
		} catch (error) {
			console.error("Failed to create approval link:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCopyLink = () => {
		if (approvalLink) {
			navigator.clipboard.writeText(approvalLink);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		setApprovalLink(null);
		setExpiresAt(null);
		setCopied(false);
	};

	if (selectedImageIds.length === 0) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
			>
				Request Approval ({selectedImageIds.length})
			</button>

			{/* Modal */}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b">
							<h2 className="text-xl font-semibold">
								{approvalLink ? "Approval Link Created" : "Request Client Approval"}
							</h2>
							<button
								type="button"
								onClick={handleClose}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>

						{/* Body */}
						<div className="p-6 space-y-4">
							{!approvalLink ? (
								<>
									<p className="text-sm text-gray-600">
										Create an approval link for {selectedImageIds.length} image
										{selectedImageIds.length > 1 ? "s" : ""}. Clients can
										approve or reject images without logging in.
									</p>

									{/* Expiration */}
									<div>
										<label
											htmlFor="expires"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Link expires in
										</label>
										<div className="flex gap-2 items-center">
											<input
												id="expires"
												type="number"
												min="1"
												max="30"
												value={expiresInDays}
												onChange={(e) =>
													setExpiresInDays(Number.parseInt(e.target.value))
												}
												className="w-20 border rounded px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
											<span className="text-sm text-gray-600">days</span>
										</div>
										<p className="text-xs text-gray-500 mt-1">
											After this period, the link will no longer work
										</p>
									</div>
								</>
							) : (
								<>
									<div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
										<div className="flex items-start gap-2">
											<svg
												className="w-5 h-5 text-green-600 mt-0.5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<title>Success</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											<div>
												<p className="text-sm font-medium text-green-800">
													Approval link created successfully
												</p>
												<p className="text-xs text-green-600 mt-1">
													Expires:{" "}
													{expiresAt?.toLocaleDateString(undefined, {
														year: "numeric",
														month: "long",
														day: "numeric",
													})}
												</p>
											</div>
										</div>
									</div>

									{/* Link Display */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Share this link with your client
										</label>
										<div className="flex gap-2">
											<input
												type="text"
												value={approvalLink}
												readOnly
												className="flex-1 border rounded px-3 py-2 bg-gray-50 text-sm"
											/>
											<button
												type="button"
												onClick={handleCopyLink}
												className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
											>
												{copied ? "Copied!" : "Copy"}
											</button>
										</div>
									</div>

									<div className="bg-blue-50 border border-blue-200 rounded p-4">
										<p className="text-sm text-blue-800">
											<strong>Note:</strong> In Phase 2, this link will be
											automatically emailed to your client. For now, copy and
											share it manually.
										</p>
									</div>
								</>
							)}
						</div>

						{/* Footer */}
						<div className="flex items-center justify-end gap-2 p-6 border-t">
							{!approvalLink ? (
								<>
									<button
										type="button"
										onClick={handleClose}
										disabled={isSubmitting}
										className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={handleSubmit}
										disabled={isSubmitting}
										className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
									>
										{isSubmitting ? "Creating..." : "Create Link"}
									</button>
								</>
							) : (
								<button
									type="button"
									onClick={handleClose}
									className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
								>
									Done
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
