"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

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

  const categories = Array.from(
    new Set(images.map((i) => i.category).filter(Boolean))
  );

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
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="mb-2 font-bold text-4xl">{subdomain}</h1>
          {portfolio.settings.bio && (
            <p className="max-w-3xl text-lg opacity-80">
              {portfolio.settings.bio}
            </p>
          )}
        </div>
      </header>

      {/* Category Filter */}
      {categories.length > 0 && (
        <nav className="border-b py-4">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex gap-4 overflow-x-auto">
              <button
                className={`whitespace-nowrap rounded px-4 py-2 ${
                  categoryFilter
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-[var(--primary-color)] text-white"
                }`}
                onClick={() => setCategoryFilter("")}
                type="button"
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  className={`whitespace-nowrap rounded px-4 py-2 ${
                    categoryFilter === category
                      ? "bg-[var(--primary-color)] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  key={category}
                  onClick={() => setCategoryFilter(category || "")}
                  type="button"
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
        <div className="container mx-auto max-w-7xl px-4">
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredImages.map((image, index) => (
                <div
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-opacity hover:opacity-90"
                  key={image.id}
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
            <div className="py-12 text-center">
              <p className="text-lg opacity-60">
                No portfolio images available yet
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Contact */}
      <footer className="mt-12 border-t py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Contact */}
            <div>
              <h3 className="mb-4 font-semibold">Get in Touch</h3>
              {portfolio.settings.contactEmail && (
                <p className="mb-2">
                  Email:{" "}
                  <a
                    className="text-[var(--accent-color)] hover:underline"
                    href={`mailto:${portfolio.settings.contactEmail}`}
                  >
                    {portfolio.settings.contactEmail}
                  </a>
                </p>
              )}
              {portfolio.settings.contactPhone && (
                <p>
                  Phone:{" "}
                  <a
                    className="text-[var(--accent-color)] hover:underline"
                    href={`tel:${portfolio.settings.contactPhone}`}
                  >
                    {portfolio.settings.contactPhone}
                  </a>
                </p>
              )}
            </div>

            {/* Social Links */}
            {portfolio.settings.socialLinks && (
              <div>
                <h3 className="mb-4 font-semibold">Follow</h3>
                <div className="flex gap-4">
                  {portfolio.settings.socialLinks.instagram && (
                    <a
                      className="text-[var(--accent-color)] hover:opacity-80"
                      href={portfolio.settings.socialLinks.instagram}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Instagram
                    </a>
                  )}
                  {portfolio.settings.socialLinks.facebook && (
                    <a
                      className="text-[var(--accent-color)] hover:opacity-80"
                      href={portfolio.settings.socialLinks.facebook}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Facebook
                    </a>
                  )}
                  {portfolio.settings.socialLinks.twitter && (
                    <a
                      className="text-[var(--accent-color)] hover:opacity-80"
                      href={portfolio.settings.socialLinks.twitter}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Twitter
                    </a>
                  )}
                  {portfolio.settings.socialLinks.linkedin && (
                    <a
                      className="text-[var(--accent-color)] hover:opacity-80"
                      href={portfolio.settings.socialLinks.linkedin}
                      rel="noopener noreferrer"
                      target="_blank"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
          <button
            className="absolute top-4 right-4 text-4xl text-white hover:opacity-70"
            onClick={() => setSelectedImage(null)}
            type="button"
          >
            ×
          </button>

          {/* Navigation */}
          {selectedImage > 0 && (
            <button
              className="absolute left-4 text-4xl text-white hover:opacity-70"
              onClick={() => setSelectedImage(selectedImage - 1)}
              type="button"
            >
              ‹
            </button>
          )}
          {selectedImage < filteredImages.length - 1 && (
            <button
              className="absolute right-4 text-4xl text-white hover:opacity-70"
              onClick={() => setSelectedImage(selectedImage + 1)}
              type="button"
            >
              ›
            </button>
          )}

          {/* Image */}
          <div className="relative flex h-full max-h-[90vh] w-full max-w-7xl items-center justify-center p-8">
            <Image
              alt={filteredImages[selectedImage].filename}
              className="object-contain"
              fill
              sizes="100vw"
              src={filteredImages[selectedImage].url}
            />
          </div>

          {/* Counter */}
          <div className="-translate-x-1/2 absolute bottom-4 left-1/2 transform text-sm text-white">
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
