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
        className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Request Approval ({selectedImageIds.length})
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="font-semibold text-xl">
                {approvalLink
                  ? "Approval Link Created"
                  : "Request Client Approval"}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={handleClose}
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-6">
              {approvalLink ? (
                <>
                  <div className="mb-4 rounded border border-green-200 bg-green-50 p-4">
                    <div className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-5 w-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Success</title>
                        <path
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-green-800 text-sm">
                          Approval link created successfully
                        </p>
                        <p className="mt-1 text-green-600 text-xs">
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
                    <label className="mb-1 block font-medium text-gray-700 text-sm">
                      Share this link with your client
                    </label>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded border bg-gray-50 px-3 py-2 text-sm"
                        readOnly
                        type="text"
                        value={approvalLink}
                      />
                      <button
                        className="whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        onClick={handleCopyLink}
                        type="button"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded border border-blue-200 bg-blue-50 p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> In Phase 2, this link will be
                      automatically emailed to your client. For now, copy and
                      share it manually.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-sm">
                    Create an approval link for {selectedImageIds.length} image
                    {selectedImageIds.length > 1 ? "s" : ""}. Clients can
                    approve or reject images without logging in.
                  </p>

                  {/* Expiration */}
                  <div>
                    <label
                      className="mb-1 block font-medium text-gray-700 text-sm"
                      htmlFor="expires"
                    >
                      Link expires in
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        className="w-20 rounded border px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="expires"
                        max="30"
                        min="1"
                        onChange={(e) =>
                          setExpiresInDays(Number.parseInt(e.target.value))
                        }
                        type="number"
                        value={expiresInDays}
                      />
                      <span className="text-gray-600 text-sm">days</span>
                    </div>
                    <p className="mt-1 text-gray-500 text-xs">
                      After this period, the link will no longer work
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t p-6">
              {approvalLink ? (
                <button
                  className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
                  onClick={handleClose}
                  type="button"
                >
                  Done
                </button>
              ) : (
                <>
                  <button
                    className="rounded border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
                    disabled={isSubmitting}
                    onClick={handleClose}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    type="button"
                  >
                    {isSubmitting ? "Creating..." : "Create Link"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
