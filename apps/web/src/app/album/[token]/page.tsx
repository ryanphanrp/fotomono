"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PublicAlbumPage() {
  const params = useParams();
  const token = params.token as string;

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // TODO: Fetch album by token
  // const { data, isLoading, error } = trpc.albumLinks.getByToken.useQuery({ token });

  const album = {
    name: "Sample Album",
    description: "Sample description",
    images: [],
    allowDownload: true,
  };

  const images: Array<{
    imageId: string;
    filename: string;
    url: string;
    thumbnailMediumUrl: string;
    width: number;
    height: number;
  }> = [];

  const handleDownloadImage = (imageId: string) => {
    // TODO: Get download URL
    console.log("Download image:", imageId);
  };

  const handleDownloadAll = () => {
    // TODO: Download all as ZIP
    console.log("Download all");
  };

  const handleSubmitFeedback = async () => {
    // TODO: Submit feedback
    setFeedbackSubmitted(true);
    setTimeout(() => setShowFeedbackForm(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-2 font-bold text-3xl">{album.name}</h1>
          {album.description && (
            <p className="text-gray-600">{album.description}</p>
          )}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-gray-500 text-sm">
              {images.length} photos
            </span>
            {album.allowDownload && (
              <>
                <button
                  className="text-blue-600 text-sm hover:underline"
                  onClick={handleDownloadAll}
                  type="button"
                >
                  Download All
                </button>
                <button
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => setShowFeedbackForm(true)}
                  type="button"
                >
                  Leave Feedback
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 py-8">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) => (
              <div
                className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-lg"
                key={image.imageId}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  alt={image.filename}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  src={image.thumbnailMediumUrl}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white py-12 text-center">
            <p className="text-gray-600">No photos in this album</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && images[selectedImage] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <button
            className="absolute top-4 right-4 text-4xl text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
            type="button"
          >
            ×
          </button>

          {/* Navigation */}
          {selectedImage > 0 && (
            <button
              className="absolute left-4 text-4xl text-white hover:text-gray-300"
              onClick={() => setSelectedImage(selectedImage - 1)}
              type="button"
            >
              ‹
            </button>
          )}
          {selectedImage < images.length - 1 && (
            <button
              className="absolute right-4 text-4xl text-white hover:text-gray-300"
              onClick={() => setSelectedImage(selectedImage + 1)}
              type="button"
            >
              ›
            </button>
          )}

          {/* Image */}
          <div className="relative flex h-full max-h-[90vh] w-full max-w-7xl items-center justify-center p-8">
            <Image
              alt={images[selectedImage].filename}
              className="object-contain"
              fill
              sizes="100vw"
              src={images[selectedImage].url}
            />
          </div>

          {/* Bottom Bar */}
          <div className="absolute right-0 bottom-0 left-0 bg-black bg-opacity-75 p-4 text-white">
            <div className="container mx-auto flex items-center justify-between">
              <span className="text-sm">
                {selectedImage + 1} / {images.length}
              </span>
              {album.allowDownload && (
                <button
                  className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700"
                  onClick={() =>
                    handleDownloadImage(images[selectedImage].imageId)
                  }
                  type="button"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="font-semibold text-xl">Leave Feedback</h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowFeedbackForm(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-6">
              {feedbackSubmitted ? (
                <div className="rounded border border-green-200 bg-green-50 p-4 text-center">
                  <p className="font-medium text-green-800">
                    Thank you for your feedback!
                  </p>
                </div>
              ) : (
                <>
                  {/* Rating */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-700 text-sm">
                      Rate your experience
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          className="text-3xl focus:outline-none"
                          key={star}
                          onClick={() => setRating(star)}
                          type="button"
                        >
                          {star <= rating ? "★" : "☆"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div>
                    <label
                      className="mb-1 block font-medium text-gray-700 text-sm"
                      htmlFor="feedback"
                    >
                      Comments (optional)
                    </label>
                    <textarea
                      className="w-full rounded border px-3 py-2"
                      id="feedback"
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                      value={feedbackText}
                    />
                  </div>

                  {/* Client Info */}
                  <div>
                    <label
                      className="mb-1 block font-medium text-gray-700 text-sm"
                      htmlFor="name"
                    >
                      Your Name (optional)
                    </label>
                    <input
                      className="w-full rounded border px-3 py-2"
                      id="name"
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Your name"
                      type="text"
                      value={clientName}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1 block font-medium text-gray-700 text-sm"
                      htmlFor="email"
                    >
                      Your Email (optional)
                    </label>
                    <input
                      className="w-full rounded border px-3 py-2"
                      id="email"
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="your@email.com"
                      type="email"
                      value={clientEmail}
                    />
                  </div>
                </>
              )}
            </div>

            {!feedbackSubmitted && (
              <div className="flex items-center justify-end gap-2 border-t p-6">
                <button
                  className="rounded border px-4 py-2 hover:bg-gray-50"
                  onClick={() => setShowFeedbackForm(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  onClick={handleSubmitFeedback}
                  type="button"
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
