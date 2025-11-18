"use client";

import Image from "next/image";
import { useState } from "react";

interface GalleryImage {
  id: string;
  filename: string;
  thumbnailMediumUrl: string;
  originalUrl: string;
  isPortfolio: boolean;
  isArchived: boolean;
  tags: string[] | null;
  category: string | null;
}

interface GalleryProps {
  images: GalleryImage[];
  onSelectImage?: (imageId: string) => void;
  onBulkSelect?: (imageIds: string[]) => void;
  selectable?: boolean;
}

export function Gallery({
  images,
  onSelectImage,
  onBulkSelect,
  selectable = false,
}: GalleryProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const toggleSelection = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
    onBulkSelect?.(Array.from(newSelected));
  };

  const selectAll = () => {
    const allIds = images.map((img) => img.id);
    setSelectedImages(new Set(allIds));
    onBulkSelect?.(allIds);
  };

  const clearSelection = () => {
    setSelectedImages(new Set());
    onBulkSelect?.([]);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {selectable && selectedImages.size > 0 && (
        <div className="flex items-center justify-between rounded border border-blue-200 bg-blue-50 p-4">
          <span className="font-medium text-sm">
            {selectedImages.size} image(s) selected
          </span>
          <div className="flex gap-2">
            <button
              className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-50"
              onClick={selectAll}
              type="button"
            >
              Select All
            </button>
            <button
              className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-50"
              onClick={clearSelection}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div
            className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all${selectedImages.has(image.id) ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-gray-300"}
						`}
            key={image.id}
            onClick={() => {
              if (selectable) {
                toggleSelection(image.id);
              } else {
                setLightboxImage(image);
              }
            }}
          >
            {/* Image */}
            <div className="relative aspect-square bg-gray-100">
              <Image
                alt={image.filename}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                src={image.thumbnailMediumUrl}
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-30" />

            {/* Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {image.isPortfolio && (
                <span className="rounded bg-green-500 px-2 py-1 text-white text-xs">
                  Portfolio
                </span>
              )}
              {image.isArchived && (
                <span className="rounded bg-gray-500 px-2 py-1 text-white text-xs">
                  Archived
                </span>
              )}
            </div>

            {/* Selection Checkbox */}
            {selectable && (
              <div className="absolute top-2 left-2">
                <input
                  checked={selectedImages.has(image.id)}
                  className="h-5 w-5 rounded"
                  onChange={() => toggleSelection(image.id)}
                  onClick={(e) => e.stopPropagation()}
                  type="checkbox"
                />
              </div>
            )}

            {/* Filename */}
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="truncate text-white text-xs">{image.filename}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <svg
            className="mx-auto mb-4 h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>No Images</title>
            <path
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <p>No images found</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-2xl text-white hover:text-gray-300"
            onClick={() => setLightboxImage(null)}
            type="button"
          >
            ✕
          </button>
          <div className="relative max-h-full max-w-7xl">
            <Image
              alt={lightboxImage.filename}
              className="max-h-[90vh] w-auto object-contain"
              height={1080}
              src={lightboxImage.originalUrl}
              width={1920}
            />
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="font-medium text-white">{lightboxImage.filename}</p>
              {lightboxImage.tags && lightboxImage.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {lightboxImage.tags.map((tag) => (
                    <span
                      className="rounded bg-gray-700 px-2 py-1 text-white text-xs"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
