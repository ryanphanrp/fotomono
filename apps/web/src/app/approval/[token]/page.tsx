"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

interface ApprovalImage {
  id: string;
  imageId: string;
  filename: string;
  thumbnailMediumUrl: string;
  url: string;
  status: "pending" | "approved" | "rejected";
  clientFeedback: string | null;
}

export default function ApprovalPage() {
  const params = useParams();
  const token = params.token as string;

  const [images, setImages] = useState<ApprovalImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ApprovalImage | null>(
    null
  );
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Fetch images using tRPC
  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const result = await trpc.approval.getByToken.query({ token });
  //       setImages(result.images);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchImages();
  // }, [token]);

  const handleApprove = async (imageId: string) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement approve
      // await trpc.approval.approve.mutate({
      //   token,
      //   imageId,
      //   feedback: feedback || undefined,
      // });

      setImages(
        images.map((img) =>
          img.imageId === imageId ? { ...img, status: "approved" } : img
        )
      );
      setSelectedImage(null);
      setFeedback("");
    } catch (err) {
      console.error("Failed to approve:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (imageId: string) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement reject
      // await trpc.approval.reject.mutate({
      //   token,
      //   imageId,
      //   feedback: feedback || undefined,
      // });

      setImages(
        images.map((img) =>
          img.imageId === imageId ? { ...img, status: "rejected" } : img
        )
      );
      setSelectedImage(null);
      setFeedback("");
    } catch (err) {
      console.error("Failed to reject:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-600 border-b-2" />
          <p className="text-gray-600">Loading images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Error</title>
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <h2 className="mb-2 font-semibold text-gray-900 text-xl">
            Unable to load images
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const pendingCount = images.filter((img) => img.status === "pending").length;
  const approvedCount = images.filter(
    (img) => img.status === "approved"
  ).length;
  const rejectedCount = images.filter(
    (img) => img.status === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h1 className="mb-2 font-bold text-3xl text-gray-900">
            Image Approval
          </h1>
          <p className="mb-4 text-gray-600">
            Please review the images below and approve or reject each one.
          </p>

          {/* Stats */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <span>Pending: {pendingCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>Approved: {approvedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>Rejected: {rejectedCount}</span>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div
              className="overflow-hidden rounded-lg bg-white shadow-sm"
              key={image.id}
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  alt={image.filename}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={image.thumbnailMediumUrl}
                />

                {/* Status Badge */}
                {image.status !== "pending" && (
                  <div className="absolute top-2 right-2">
                    {image.status === "approved" ? (
                      <span className="rounded-full bg-green-500 px-3 py-1 font-medium text-sm text-white">
                        ✓ Approved
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-500 px-3 py-1 font-medium text-sm text-white">
                        ✕ Rejected
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4">
                <p className="mb-3 truncate text-gray-600 text-sm">
                  {image.filename}
                </p>

                {image.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      className="flex-1 rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                      onClick={() => setSelectedImage(image)}
                      type="button"
                    >
                      Approve
                    </button>
                    <button
                      className="flex-1 rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                      onClick={() => setSelectedImage(image)}
                      type="button"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="py-2 text-center">
                    <span className="text-gray-500 text-sm">
                      {image.status === "approved"
                        ? "✓ Approved"
                        : "✕ Rejected"}
                    </span>
                    {image.clientFeedback && (
                      <p className="mt-1 text-gray-400 text-xs italic">
                        "{image.clientFeedback}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {images.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">No images to review</p>
          </div>
        )}

        {/* Completion Message */}
        {pendingCount === 0 && images.length > 0 && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
            <svg
              className="mx-auto mb-3 h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Complete</title>
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <h3 className="mb-1 font-semibold text-green-900 text-lg">
              All images reviewed!
            </h3>
            <p className="text-green-700">
              Thank you for your feedback. You can close this page now.
            </p>
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div className="border-b p-6">
              <h2 className="font-semibold text-xl">
                {selectedImage.filename}
              </h2>
            </div>

            {/* Image Preview */}
            <div className="p-6">
              <div className="relative mb-4 aspect-video rounded bg-gray-100">
                <Image
                  alt={selectedImage.filename}
                  className="object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={selectedImage.url}
                />
              </div>

              {/* Feedback */}
              <div className="mb-4">
                <label
                  className="mb-1 block font-medium text-gray-700 text-sm"
                  htmlFor="feedback"
                >
                  Feedback (optional)
                </label>
                <textarea
                  className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="feedback"
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Add any comments or suggestions..."
                  rows={3}
                  value={feedback}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t p-6">
              <button
                className="rounded border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={() => {
                  setSelectedImage(null);
                  setFeedback("");
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={() => handleReject(selectedImage.imageId)}
                type="button"
              >
                {isSubmitting ? "Rejecting..." : "Reject"}
              </button>
              <button
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={() => handleApprove(selectedImage.imageId)}
                type="button"
              >
                {isSubmitting ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
