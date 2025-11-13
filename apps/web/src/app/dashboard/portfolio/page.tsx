"use client";

import { useState } from "react";
import { Gallery } from "@/components/images/Gallery";

export default function PortfolioPage() {
	const [sortBy, setSortBy] = useState<
		"date_asc" | "date_desc" | "position" | "category"
	>("position");
	const [categoryFilter, setCategoryFilter] = useState<string>("");
	const [tagFilter, setTagFilter] = useState<string[]>([]);

	// TODO: Use tRPC to fetch portfolio images
	// const { data, isLoading } = trpc.portfolio.list.useQuery({
	//   sortBy,
	//   category: categoryFilter || undefined,
	//   tags: tagFilter.length > 0 ? tagFilter : undefined,
	// });

	// Mock data for now
	const portfolioImages: Array<{
		id: string;
		filename: string;
		thumbnailMediumUrl: string;
		originalUrl: string;
		isPortfolio: boolean;
		isArchived: boolean;
		tags: string[] | null;
		category: string | null;
	}> = [];

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">Portfolio</h1>
			</div>

			{/* Filters and Sorting */}
			<div className="bg-white rounded-lg border p-4 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Sort */}
					<div>
						<label
							htmlFor="sort"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Sort By
						</label>
						<select
							id="sort"
							value={sortBy}
							onChange={(e) =>
								setSortBy(
									e.target.value as
										| "date_asc"
										| "date_desc"
										| "position"
										| "category",
								)
							}
							className="w-full border rounded px-3 py-2"
						>
							<option value="position">Custom Order</option>
							<option value="date_desc">Newest First</option>
							<option value="date_asc">Oldest First</option>
							<option value="category">By Category</option>
						</select>
					</div>

					{/* Category Filter */}
					<div>
						<label
							htmlFor="category"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Category
						</label>
						<select
							id="category"
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="w-full border rounded px-3 py-2"
						>
							<option value="">All Categories</option>
							{/* TODO: Populate from tRPC query */}
						</select>
					</div>

					{/* Tag Filter */}
					<div>
						<label
							htmlFor="tags"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Tags
						</label>
						<input
							id="tags"
							type="text"
							placeholder="Filter by tags..."
							className="w-full border rounded px-3 py-2"
							onChange={(e) => {
								const tags = e.target.value
									.split(",")
									.map((t) => t.trim())
									.filter(Boolean);
								setTagFilter(tags);
							}}
						/>
					</div>
				</div>

				{/* Active Filters */}
				{(categoryFilter || tagFilter.length > 0) && (
					<div className="mt-4 flex items-center gap-2 flex-wrap">
						<span className="text-sm text-gray-600">Active filters:</span>
						{categoryFilter && (
							<span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded flex items-center gap-1">
								Category: {categoryFilter}
								<button
									type="button"
									onClick={() => setCategoryFilter("")}
									className="hover:text-blue-900"
								>
									✕
								</button>
							</span>
						)}
						{tagFilter.map((tag) => (
							<span
								key={tag}
								className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded flex items-center gap-1"
							>
								Tag: {tag}
								<button
									type="button"
									onClick={() =>
										setTagFilter(tagFilter.filter((t) => t !== tag))
									}
									className="hover:text-green-900"
								>
									✕
								</button>
							</span>
						))}
						<button
							type="button"
							onClick={() => {
								setCategoryFilter("");
								setTagFilter([]);
							}}
							className="text-xs text-gray-600 hover:text-gray-800 underline"
						>
							Clear all
						</button>
					</div>
				)}
			</div>

			{/* Gallery */}
			<Gallery images={portfolioImages} selectable={false} />

			{/* Empty State */}
			{portfolioImages.length === 0 && (
				<div className="text-center py-12 bg-white rounded-lg border">
					<svg
						className="mx-auto h-16 w-16 text-gray-400 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Empty Portfolio</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No portfolio images yet
					</h3>
					<p className="text-gray-600 mb-4">
						Start building your portfolio by adding images from your shows
					</p>
					<a
						href="/dashboard/shows"
						className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Browse Shows
					</a>
				</div>
			)}
		</div>
	);
}
