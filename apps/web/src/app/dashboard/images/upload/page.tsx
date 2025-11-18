"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/images/ImageUpload";
import { trpc } from "@/lib/trpc";

export default function UploadImagesPage() {
  const [selectedShowId, setSelectedShowId] = useState<string>("");

  const { data: shows } = trpc.shows.list.useQuery({});

  const handleUploadComplete = (results: unknown[]) => {
    console.log("Upload complete:", results);
    // Optionally redirect or show success message
    alert(`${results.length} images uploaded successfully!`);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 font-bold text-3xl">Upload Images</h1>

      <div className="space-y-6">
        {/* Show Selection */}
        <div className="rounded-lg bg-white p-6 shadow">
          <label className="mb-2 block font-medium text-sm">
            Select Show/Session
          </label>
          <select
            className="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedShowId(e.target.value)}
            value={selectedShowId}
          >
            <option value="">Choose a show...</option>
            {shows?.shows.map((show) => (
              <option key={show.id} value={show.id}>
                {show.title} - {show.clientName} (
                {new Date(show.dateStart).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {/* Upload Component */}
        <div className="rounded-lg bg-white p-6 shadow">
          {selectedShowId ? (
            <ImageUpload
              maxFiles={50}
              maxSize={50}
              onUploadComplete={handleUploadComplete}
              showId={selectedShowId}
            />
          ) : (
            <div className="py-12 text-center text-gray-500">
              <p>Please select a show first</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="rounded border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-medium text-blue-900">Upload Tips</h3>
          <ul className="space-y-1 text-blue-800 text-sm">
            <li>• Supported formats: JPEG, PNG, WEBP, HEIC</li>
            <li>• Maximum file size: 50MB per image</li>
            <li>• You can upload up to 50 images at once</li>
            <li>
              • Images will be automatically optimized and thumbnails generated
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
