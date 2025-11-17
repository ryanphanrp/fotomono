"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

export default function PublicPortfolioPage() {
	const params = useParams();
	const subdomain = params.subdomain as string;

	const [selectedImage, setSelectedImage] = useState<number | null>(null);
	const [categoryFilter, setCategoryFilter] = useState<string>("");

	// TODO: Fetch portfolio data
	// const { data, isLoading, error } = trpc.portfolio.getPublicData.useQuery({ subdomain });

	const portfolio = {
		settings: {
			subdomain: "sample",
			theme: "default",
			primaryColor: "#000000",
			accentColor: "#FF6B6B",
			bio: "Sample bio",
			contactEmail: "contact@example.com",
			contactPhone: null,
			socialLinks: {},
		},
		images: [],
		categories: [],
	};

	const images: Array<{
		id: string;
		category: string | null;
		thumbnailMediumUrl: string;
		url: string;
		filename: string;
	}> = [];

	const filteredImages = categoryFilter
		? images.filter((img) => img.category === categoryFilter)
		: images;

	const categories = Array.from(new Set(images.map((i) => i.category).filter(Boolean)));

	// Apply theme
	const themeClasses = {
		default: "bg-white text-gray-900",
		minimal: "bg-white text-gray-800",
		modern: "bg-gray-900 text-white",
	};

	const currentTheme =
		themeClasses[portfolio.settings.theme as keyof typeof themeClasses] ||
		themeClasses.default;

	return (
		<div
			className={`min-h-screen ${currentTheme}`}
			style={
				{
					"--primary-color": portfolio.settings.primaryColor,
					"--accent-color": portfolio.settings.accentColor,
				} as React.CSSProperties
			}
		>
			{/* Header */}
			<header className="border-b py-8">
				<div className="container mx-auto px-4 max-w-7xl">
					<h1 className="text-4xl font-bold mb-2">{subdomain}</h1>
					{portfolio.settings.bio && (
						<p className="text-lg opacity-80 max-w-3xl">{portfolio.settings.bio}</p>
					)}
				</div>
			</header>

			{/* Category Filter */}
			{categories.length > 0 && (
				<nav className="border-b py-4">
					<div className="container mx-auto px-4 max-w-7xl">
						<div className="flex gap-4 overflow-x-auto">
							<button
								type="button"
								onClick={() => setCategoryFilter("")}
								className={`px-4 py-2 rounded whitespace-nowrap ${
									!categoryFilter
										? "bg-[var(--primary-color)] text-white"
										: "bg-gray-100 hover:bg-gray-200"
								}`}
							>
								All
							</button>
							{categories.map((category) => (
								<button
									key={category}
									type="button"
									onClick={() => setCategoryFilter(category || "")}
									className={`px-4 py-2 rounded whitespace-nowrap ${
										categoryFilter === category
											? "bg-[var(--primary-color)] text-white"
											: "bg-gray-100 hover:bg-gray-200"
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>
				</nav>
			)}

			{/* Portfolio Grid */}
			<main className="py-8">
				<div className="container mx-auto px-4 max-w-7xl">
					{filteredImages.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{filteredImages.map((image, index) => (
								<div
									key={image.id}
									onClick={() => setSelectedImage(index)}
									className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
								>
									<Image
										src={image.thumbnailMediumUrl}
										alt={image.filename}
										fill
										className="object-cover"
										sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
									/>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-lg opacity-60">
								No portfolio images available yet
							</p>
						</div>
					)}
				</div>
			</main>

			{/* Footer / Contact */}
			<footer className="border-t py-8 mt-12">
				<div className="container mx-auto px-4 max-w-7xl">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Contact */}
						<div>
							<h3 className="font-semibold mb-4">Get in Touch</h3>
							{portfolio.settings.contactEmail && (
								<p className="mb-2">
									Email:{" "}
									<a
										href={`mailto:${portfolio.settings.contactEmail}`}
										className="text-[var(--accent-color)] hover:underline"
									>
										{portfolio.settings.contactEmail}
									</a>
								</p>
							)}
							{portfolio.settings.contactPhone && (
								<p>
									Phone:{" "}
									<a
										href={`tel:${portfolio.settings.contactPhone}`}
										className="text-[var(--accent-color)] hover:underline"
									>
										{portfolio.settings.contactPhone}
									</a>
								</p>
							)}
						</div>

						{/* Social Links */}
						{portfolio.settings.socialLinks && (
							<div>
								<h3 className="font-semibold mb-4">Follow</h3>
								<div className="flex gap-4">
									{portfolio.settings.socialLinks.instagram && (
										<a
											href={portfolio.settings.socialLinks.instagram}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[var(--accent-color)] hover:opacity-80"
										>
											Instagram
										</a>
									)}
									{portfolio.settings.socialLinks.facebook && (
										<a
											href={portfolio.settings.socialLinks.facebook}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[var(--accent-color)] hover:opacity-80"
										>
											Facebook
										</a>
									)}
									{portfolio.settings.socialLinks.twitter && (
										<a
											href={portfolio.settings.socialLinks.twitter}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[var(--accent-color)] hover:opacity-80"
										>
											Twitter
										</a>
									)}
									{portfolio.settings.socialLinks.linkedin && (
										<a
											href={portfolio.settings.socialLinks.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[var(--accent-color)] hover:opacity-80"
										>
											LinkedIn
										</a>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</footer>

			{/* Lightbox */}
			{selectedImage !== null && filteredImages[selectedImage] && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
					<button
						type="button"
						onClick={() => setSelectedImage(null)}
						className="absolute top-4 right-4 text-white text-4xl hover:opacity-70"
					>
						×
					</button>

					{/* Navigation */}
					{selectedImage > 0 && (
						<button
							type="button"
							onClick={() => setSelectedImage(selectedImage - 1)}
							className="absolute left-4 text-white text-4xl hover:opacity-70"
						>
							‹
						</button>
					)}
					{selectedImage < filteredImages.length - 1 && (
						<button
							type="button"
							onClick={() => setSelectedImage(selectedImage + 1)}
							className="absolute right-4 text-white text-4xl hover:opacity-70"
						>
							›
						</button>
					)}

					{/* Image */}
					<div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8">
						<Image
							src={filteredImages[selectedImage].url}
							alt={filteredImages[selectedImage].filename}
							fill
							className="object-contain"
							sizes="100vw"
						/>
					</div>

					{/* Counter */}
					<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
						{selectedImage + 1} / {filteredImages.length}
					</div>
				</div>
			)}
		</div>
	);
}

// TODO: Generate metadata dynamically
// export async function generateMetadata({ params }): Promise<Metadata> {
//   const { subdomain } = params;
//   const data = await portfolioService.getPublicData(subdomain);
//   return {
//     title: `${subdomain} - Photography Portfolio`,
//     description: data.settings.bio || 'Professional photography portfolio',
//     openGraph: {
//       title: data.settings.metaTitle || `${subdomain} - Photography`,
//       description: data.settings.metaDescription || data.settings.bio,
//     },
//   };
// }
