"use client";

import Link from "next/link";

export default function AlbumsPage() {
  // TODO: Use tRPC to fetch albums
  // const { data, isLoading } = trpc.albums.list.useQuery();

  const albums: Array<{
    id: string;
    name: string;
    description: string | null;
    showName: string;
    imageCount: number;
    createdAt: Date;
  }> = [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Client Albums</h1>
          <p className="mt-1 text-gray-600">
            Create and manage albums to share with clients
          </p>
        </div>
        <Link
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          href="/dashboard/albums/new"
        >
          Create Album
        </Link>
      </div>

      {/* Albums Grid */}
      {albums.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link
              className="block rounded-lg border bg-white transition-shadow hover:shadow-lg"
              href={`/dashboard/albums/${album.id}`}
              key={album.id}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-t-lg bg-gray-100">
                {/* TODO: Show first image from album */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg
                    className="h-16 w-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Album</title>
                    <path
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    />
                  </svg>
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="mb-1 font-semibold text-lg">{album.name}</h3>
                {album.description && (
                  <p className="mb-2 line-clamp-2 text-gray-600 text-sm">
                    {album.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span>From: {album.showName}</span>
                  <span>{album.imageCount} images</span>
                </div>
                <div className="mt-2 text-gray-400 text-xs">
                  Created {new Date(album.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white py-12 text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>No Albums</title>
            <path
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <h3 className="mb-2 font-medium text-gray-900 text-lg">
            No albums yet
          </h3>
          <p className="mb-4 text-gray-600">
            Create your first album to share photos with clients
          </p>
          <Link
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            href="/dashboard/albums/new"
          >
            Create Your First Album
          </Link>
        </div>
      )}
    </div>
  );
}
