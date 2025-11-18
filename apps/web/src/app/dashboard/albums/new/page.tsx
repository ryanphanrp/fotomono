"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewAlbumPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedShowId, setSelectedShowId] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Fetch shows
  // const { data: showsData } = trpc.shows.list.useQuery();
  const shows: Array<{ id: string; name: string }> = [];

  // TODO: Fetch images for selected show
  // const { data: imagesData } = trpc.images.getByShow.useQuery(
  //   { showId: selectedShowId },
  //   { enabled: !!selectedShowId }
  // );
  const images: Array<{
    id: string;
    filename: string;
    thumbnailSmallUrl: string;
  }> = [];

  const handleImageToggle = (imageId: string) => {
    setSelectedImageIds((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(name && selectedShowId)) {
      alert("Please provide album name and select a show");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Create album
      // const result = await createAlbum.mutateAsync({
      //   name,
      //   description,
      //   showId: selectedShowId,
      //   imageIds: selectedImageIds,
      // });
      // router.push(`/dashboard/albums/${result.album.id}`);
    } catch (error) {
      console.error("Failed to create album:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">Create New Album</h1>
        <p className="mt-1 text-gray-600">
          Create a curated collection of photos to share with clients
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Album Details */}
        <div className="space-y-4 rounded-lg border bg-white p-6">
          <h2 className="font-semibold text-xl">Album Details</h2>

          {/* Name */}
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="name"
            >
              Album Name *
            </label>
            <input
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sarah & John - Wedding Selection"
              required
              type="text"
              value={name}
            />
          </div>

          {/* Description */}
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="description"
            >
              Description (optional)
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this album..."
              rows={3}
              value={description}
            />
          </div>

          {/* Show Selection */}
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="show"
            >
              Select Show *
            </label>
            <select
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="show"
              onChange={(e) => setSelectedShowId(e.target.value)}
              required
              value={selectedShowId}
            >
              <option value="">Choose a show...</option>
              {shows.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Selection */}
        {selectedShowId && (
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-xl">Select Images</h2>
              <span className="text-gray-600 text-sm">
                {selectedImageIds.length} selected
              </span>
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image) => (
                  <div
                    className={`relative aspect-square cursor-pointer overflow-hidden rounded border-2 ${
                      selectedImageIds.includes(image.id)
                        ? "border-blue-500 ring-2 ring-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    key={image.id}
                    onClick={() => handleImageToggle(image.id)}
                  >
                    <Image
                      alt={image.filename}
                      className="object-cover"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      src={image.thumbnailSmallUrl}
                    />
                    {selectedImageIds.includes(image.id) && (
                      <div className="absolute top-2 right-2 rounded-full bg-blue-500 p-1 text-white">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <title>Selected</title>
                          <path
                            d="M5 13l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-gray-500">
                No images found in this show
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            className="rounded border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            disabled={isSubmitting}
            onClick={() => router.back()}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting || !name || !selectedShowId}
            type="submit"
          >
            {isSubmitting ? "Creating..." : "Create Album"}
          </button>
        </div>
      </form>
    </div>
  );
}
