"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function AlbumDetailPage() {
	const params = useParams();
	const albumId = params.id as string;

	const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false);
	const [expirationDate, setExpirationDate] = useState("");
	const [allowDownload, setAllowDownload] = useState(true);
	const [generatedLink, setGeneratedLink] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	// TODO: Fetch album
	// const { data: album } = trpc.albums.getById.useQuery({ albumId });

	// TODO: Fetch links
	// const { data: linksData } = trpc.albumLinks.list.useQuery({ albumId });

	const album = {
		name: "Sample Album",
		description: "Sample description",
		showName: "Sample Show",
		images: [],
	};

	const links: Array<{
		id: string;
		token: string;
		isActive: boolean;
		expirationDate: Date | null;
		accessedCount: number;
		lastAccessedAt: Date | null;
		createdAt: Date;
	}> = [];

	const handleGenerateLink = () => {
		// TODO: Generate link
		const mockToken = `mock_${Date.now()}`;
		const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
		setGeneratedLink(`${baseUrl}/album/${mockToken}`);
	};

	const handleCopyLink = (link: string) => {
		navigator.clipboard.writeText(link);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold">{album.name}</h1>
				{album.description && (
					<p className="text-gray-600 mt-1">{album.description}</p>
				)}
				<p className="text-sm text-gray-500 mt-1">From: {album.showName}</p>
			</div>

			{/* Actions */}
			<div className="flex gap-3 mb-6">
				<button
					type="button"
					onClick={() => setShowGenerateLinkModal(true)}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Generate Shareable Link
				</button>
				<button
					type="button"
					className="px-4 py-2 border rounded hover:bg-gray-50"
				>
					Add Images
				</button>
			</div>

			{/* Images Grid */}
			<div className="bg-white rounded-lg border p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">
					Images ({album.images.length})
				</h2>
				{album.images.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
						{/* TODO: Map images */}
					</div>
				) : (
					<p className="text-center text-gray-500 py-8">
						No images in this album yet
					</p>
				)}
			</div>

			{/* Links Management */}
			<div className="bg-white rounded-lg border p-6">
				<h2 className="text-xl font-semibold mb-4">Shareable Links</h2>
				{links.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b text-left text-sm text-gray-600">
									<th className="pb-2">Status</th>
									<th className="pb-2">Link</th>
									<th className="pb-2">Expires</th>
									<th className="pb-2">Views</th>
									<th className="pb-2">Last Accessed</th>
									<th className="pb-2">Actions</th>
								</tr>
							</thead>
							<tbody className="text-sm">
								{links.map((link) => (
									<tr key={link.id} className="border-b">
										<td className="py-3">
											{link.isActive ? (
												<span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
													Active
												</span>
											) : (
												<span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
													Inactive
												</span>
											)}
										</td>
										<td className="py-3">
											<button
												type="button"
												onClick={() =>
													handleCopyLink(
														`${window.location.origin}/album/${link.token}`,
													)
												}
												className="text-blue-600 hover:underline truncate max-w-xs block"
											>
												/album/{link.token.substring(0, 12)}...
											</button>
										</td>
										<td className="py-3">
											{link.expirationDate
												? new Date(link.expirationDate).toLocaleDateString()
												: "Never"}
										</td>
										<td className="py-3">{link.accessedCount}</td>
										<td className="py-3">
											{link.lastAccessedAt
												? new Date(link.lastAccessedAt).toLocaleDateString()
												: "Never"}
										</td>
										<td className="py-3">
											<button
												type="button"
												className="text-red-600 hover:underline text-xs"
											>
												Deactivate
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-center text-gray-500 py-8">
						No shareable links yet. Generate one to share this album with
						clients.
					</p>
				)}
			</div>

			{/* Generate Link Modal */}
			{showGenerateLinkModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
						<div className="flex items-center justify-between p-6 border-b">
							<h2 className="text-xl font-semibold">Generate Shareable Link</h2>
							<button
								type="button"
								onClick={() => {
									setShowGenerateLinkModal(false);
									setGeneratedLink(null);
								}}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>

						<div className="p-6 space-y-4">
							{!generatedLink ? (
								<>
									<div>
										<label
											htmlFor="expiration"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Expiration Date (optional)
										</label>
										<input
											id="expiration"
											type="date"
											value={expirationDate}
											onChange={(e) => setExpirationDate(e.target.value)}
											className="w-full border rounded px-3 py-2"
										/>
									</div>

									<div className="flex items-center gap-2">
										<input
											id="allowDownload"
											type="checkbox"
											checked={allowDownload}
											onChange={(e) => setAllowDownload(e.target.checked)}
										/>
										<label
											htmlFor="allowDownload"
											className="text-sm text-gray-700"
										>
											Allow clients to download images
										</label>
									</div>
								</>
							) : (
								<>
									<div className="bg-green-50 border border-green-200 rounded p-4">
										<p className="text-sm font-medium text-green-800 mb-2">
											Link created successfully!
										</p>
										<div className="flex gap-2">
											<input
												type="text"
												value={generatedLink}
												readOnly
												className="flex-1 border rounded px-3 py-2 bg-white text-sm"
											/>
											<button
												type="button"
												onClick={() => handleCopyLink(generatedLink)}
												className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
											>
												{copied ? "Copied!" : "Copy"}
											</button>
										</div>
									</div>
								</>
							)}
						</div>

						<div className="flex items-center justify-end gap-2 p-6 border-t">
							{!generatedLink ? (
								<>
									<button
										type="button"
										onClick={() => setShowGenerateLinkModal(false)}
										className="px-4 py-2 border rounded hover:bg-gray-50"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={handleGenerateLink}
										className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
									>
										Generate Link
									</button>
								</>
							) : (
								<button
									type="button"
									onClick={() => {
										setShowGenerateLinkModal(false);
										setGeneratedLink(null);
									}}
									className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
								>
									Done
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
