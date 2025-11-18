"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Gallery } from "@/components/images/Gallery";
import { trpc } from "@/lib/trpc";

type FilterType = "all" | "portfolio" | "archived";

export default function ShowImagesPage() {
  const params = useParams();
  const showId = params.id as string;

  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  const { data: imagesData, refetch } = trpc.images.getByShow.useQuery({
    showId,
    filter,
  });

  const bulkUpdate = trpc.images.bulkUpdate.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedImageIds([]);
    },
  });

  const handleBulkAction = async (operation: string) => {
    if (selectedImageIds.length === 0) return;

    try {
      await bulkUpdate.mutateAsync({
        imageIds: selectedImageIds,
        operation: operation as never,
      });
      alert("Images updated successfully");
    } catch (error) {
      alert("Failed to update images");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">Show Images</h1>
        <p className="mt-1 text-gray-600">
          {imagesData?.total || 0} images total
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            className={`rounded px-4 py-2 ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("all")}
            type="button"
          >
            All
          </button>
          <button
            className={`rounded px-4 py-2 ${filter === "portfolio" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("portfolio")}
            type="button"
          >
            Portfolio
          </button>
          <button
            className={`rounded px-4 py-2 ${filter === "archived" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("archived")}
            type="button"
          >
            Archived
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedImageIds.length > 0 && (
          <div className="flex gap-2">
            <button
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              onClick={() => handleBulkAction("mark_portfolio")}
              type="button"
            >
              Mark Portfolio
            </button>
            <button
              className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              onClick={() => handleBulkAction("archive")}
              type="button"
            >
              Archive
            </button>
            <button
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              onClick={() => handleBulkAction("delete")}
              type="button"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Gallery */}
      <Gallery
        images={imagesData?.images || []}
        onBulkSelect={setSelectedImageIds}
        selectable
      />
    </div>
  );
}
