"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold">Client Albums</h1>
					<p className="text-gray-600 mt-1">
						Create and manage albums to share with clients
					</p>
				</div>
				<Link
					href="/dashboard/albums/new"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Create Album
				</Link>
			</div>

			{/* Albums Grid */}
			{albums.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{albums.map((album) => (
						<Link
							key={album.id}
							href={`/dashboard/albums/${album.id}`}
							className="block bg-white rounded-lg border hover:shadow-lg transition-shadow"
						>
							{/* Thumbnail */}
							<div className="relative aspect-video bg-gray-100 rounded-t-lg">
								{/* TODO: Show first image from album */}
								<div className="absolute inset-0 flex items-center justify-center text-gray-400">
									<svg
										className="w-16 h-16"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>Album</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
							</div>

							{/* Details */}
							<div className="p-4">
								<h3 className="font-semibold text-lg mb-1">{album.name}</h3>
								{album.description && (
									<p className="text-sm text-gray-600 mb-2 line-clamp-2">
										{album.description}
									</p>
								)}
								<div className="flex items-center gap-4 text-sm text-gray-500">
									<span>From: {album.showName}</span>
									<span>{album.imageCount} images</span>
								</div>
								<div className="text-xs text-gray-400 mt-2">
									Created {new Date(album.createdAt).toLocaleDateString()}
								</div>
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className="text-center py-12 bg-white rounded-lg border">
					<svg
						className="mx-auto h-16 w-16 text-gray-400 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>No Albums</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No albums yet
					</h3>
					<p className="text-gray-600 mb-4">
						Create your first album to share photos with clients
					</p>
					<Link
						href="/dashboard/albums/new"
						className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Create Your First Album
					</Link>
				</div>
			)}
		</div>
	);
}
