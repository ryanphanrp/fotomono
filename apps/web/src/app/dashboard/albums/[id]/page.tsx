"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

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
        <h1 className="font-bold text-3xl">{album.name}</h1>
        {album.description && (
          <p className="mt-1 text-gray-600">{album.description}</p>
        )}
        <p className="mt-1 text-gray-500 text-sm">From: {album.showName}</p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-3">
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => setShowGenerateLinkModal(true)}
          type="button"
        >
          Generate Shareable Link
        </button>
        <button
          className="rounded border px-4 py-2 hover:bg-gray-50"
          type="button"
        >
          Add Images
        </button>
      </div>

      {/* Images Grid */}
      <div className="mb-6 rounded-lg border bg-white p-6">
        <h2 className="mb-4 font-semibold text-xl">
          Images ({album.images.length})
        </h2>
        {album.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {/* TODO: Map images */}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500">
            No images in this album yet
          </p>
        )}
      </div>

      {/* Links Management */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 font-semibold text-xl">Shareable Links</h2>
        {links.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-gray-600 text-sm">
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
                  <tr className="border-b" key={link.id}>
                    <td className="py-3">
                      {link.isActive ? (
                        <span className="rounded bg-green-100 px-2 py-1 text-green-800 text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="rounded bg-gray-100 px-2 py-1 text-gray-800 text-xs">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <button
                        className="block max-w-xs truncate text-blue-600 hover:underline"
                        onClick={() =>
                          handleCopyLink(
                            `${window.location.origin}/album/${link.token}`
                          )
                        }
                        type="button"
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
                        className="text-red-600 text-xs hover:underline"
                        type="button"
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
          <p className="py-8 text-center text-gray-500">
            No shareable links yet. Generate one to share this album with
            clients.
          </p>
        )}
      </div>

      {/* Generate Link Modal */}
      {showGenerateLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="font-semibold text-xl">Generate Shareable Link</h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowGenerateLinkModal(false);
                  setGeneratedLink(null);
                }}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-6">
              {generatedLink ? (
                <>
                  <div className="rounded border border-green-200 bg-green-50 p-4">
                    <p className="mb-2 font-medium text-green-800 text-sm">
                      Link created successfully!
                    </p>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded border bg-white px-3 py-2 text-sm"
                        readOnly
                        type="text"
                        value={generatedLink}
                      />
                      <button
                        className="whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        onClick={() => handleCopyLink(generatedLink)}
                        type="button"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      className="mb-1 block font-medium text-gray-700 text-sm"
                      htmlFor="expiration"
                    >
                      Expiration Date (optional)
                    </label>
                    <input
                      className="w-full rounded border px-3 py-2"
                      id="expiration"
                      onChange={(e) => setExpirationDate(e.target.value)}
                      type="date"
                      value={expirationDate}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      checked={allowDownload}
                      id="allowDownload"
                      onChange={(e) => setAllowDownload(e.target.checked)}
                      type="checkbox"
                    />
                    <label
                      className="text-gray-700 text-sm"
                      htmlFor="allowDownload"
                    >
                      Allow clients to download images
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t p-6">
              {generatedLink ? (
                <button
                  className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
                  onClick={() => {
                    setShowGenerateLinkModal(false);
                    setGeneratedLink(null);
                  }}
                  type="button"
                >
                  Done
                </button>
              ) : (
                <>
                  <button
                    className="rounded border px-4 py-2 hover:bg-gray-50"
                    onClick={() => setShowGenerateLinkModal(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={handleGenerateLink}
                    type="button"
                  >
                    Generate Link
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
