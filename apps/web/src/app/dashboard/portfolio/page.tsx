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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl">Portfolio</h1>
      </div>

      {/* Filters and Sorting */}
      <div className="mb-6 rounded-lg border bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Sort */}
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="sort"
            >
              Sort By
            </label>
            <select
              className="w-full rounded border px-3 py-2"
              id="sort"
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "date_asc"
                    | "date_desc"
                    | "position"
                    | "category"
                )
              }
              value={sortBy}
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
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="category"
            >
              Category
            </label>
            <select
              className="w-full rounded border px-3 py-2"
              id="category"
              onChange={(e) => setCategoryFilter(e.target.value)}
              value={categoryFilter}
            >
              <option value="">All Categories</option>
              {/* TODO: Populate from tRPC query */}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="tags"
            >
              Tags
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              id="tags"
              onChange={(e) => {
                const tags = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                setTagFilter(tags);
              }}
              placeholder="Filter by tags..."
              type="text"
            />
          </div>
        </div>

        {/* Active Filters */}
        {(categoryFilter || tagFilter.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-gray-600 text-sm">Active filters:</span>
            {categoryFilter && (
              <span className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-blue-800 text-xs">
                Category: {categoryFilter}
                <button
                  className="hover:text-blue-900"
                  onClick={() => setCategoryFilter("")}
                  type="button"
                >
                  ✕
                </button>
              </span>
            )}
            {tagFilter.map((tag) => (
              <span
                className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-green-800 text-xs"
                key={tag}
              >
                Tag: {tag}
                <button
                  className="hover:text-green-900"
                  onClick={() =>
                    setTagFilter(tagFilter.filter((t) => t !== tag))
                  }
                  type="button"
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              className="text-gray-600 text-xs underline hover:text-gray-800"
              onClick={() => {
                setCategoryFilter("");
                setTagFilter([]);
              }}
              type="button"
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
        <div className="rounded-lg border bg-white py-12 text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Empty Portfolio</title>
            <path
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <h3 className="mb-2 font-medium text-gray-900 text-lg">
            No portfolio images yet
          </h3>
          <p className="mb-4 text-gray-600">
            Start building your portfolio by adding images from your shows
          </p>
          <a
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            href="/dashboard/shows"
          >
            Browse Shows
          </a>
        </div>
      )}
    </div>
  );
}
