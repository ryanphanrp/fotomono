"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PortfolioSettingsPage() {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState("");
  const [theme, setTheme] = useState("default");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [accentColor, setAccentColor] = useState("#FF6B6B");
  const [bio, setBio] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(
    null
  );

  // TODO: Fetch current settings
  // const { data: settings } = trpc.portfolio.getSettings.useQuery();

  // TODO: Check subdomain availability
  const checkSubdomain = async (value: string) => {
    if (value.length < 3) {
      setSubdomainAvailable(null);
      return;
    }
    // TODO: Call trpc.portfolio.checkSubdomain
    setSubdomainAvailable(true); // Mock
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Update settings
      // await updateSettings.mutateAsync({
      //   subdomain,
      //   theme,
      //   primaryColor,
      //   accentColor,
      //   bio,
      //   contactEmail,
      //   contactPhone,
      //   socialLinks: {
      //     instagram,
      //     facebook,
      //     twitter,
      //     linkedin,
      //   },
      // });

      alert("Settings saved!");
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const themes = [
    { id: "default", name: "Default", description: "Clean and professional" },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant white space",
    },
    { id: "modern", name: "Modern", description: "Bold and contemporary" },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">Portfolio Settings</h1>
        <p className="mt-1 text-gray-600">
          Customize your public portfolio website
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Subdomain */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 font-semibold text-xl">Your Portfolio URL</h2>
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="subdomain"
            >
              Subdomain *
            </label>
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="subdomain"
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  setSubdomain(value);
                  checkSubdomain(value);
                }}
                pattern="[a-z0-9-]+"
                placeholder="yourname"
                required
                type="text"
                value={subdomain}
              />
              <span className="text-gray-600">.fotomono.com</span>
            </div>
            {subdomainAvailable === true && (
              <p className="mt-1 text-green-600 text-xs">✓ Available</p>
            )}
            {subdomainAvailable === false && (
              <p className="mt-1 text-red-600 text-xs">✗ Already taken</p>
            )}
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 font-semibold text-xl">Theme</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {themes.map((t) => (
              <button
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  theme === t.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                key={t.id}
                onClick={() => setTheme(t.id)}
                type="button"
              >
                <h3 className="mb-1 font-semibold">{t.name}</h3>
                <p className="text-gray-600 text-xs">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 font-semibold text-xl">Colors</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="primaryColor"
              >
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="h-10 w-20 cursor-pointer rounded border"
                  id="primaryColor"
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  type="color"
                  value={primaryColor}
                />
                <input
                  className="flex-1 rounded border px-3 py-2 font-mono text-sm"
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  type="text"
                  value={primaryColor}
                />
              </div>
            </div>
            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="accentColor"
              >
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="h-10 w-20 cursor-pointer rounded border"
                  id="accentColor"
                  onChange={(e) => setAccentColor(e.target.value)}
                  type="color"
                  value={accentColor}
                />
                <input
                  className="flex-1 rounded border px-3 py-2 font-mono text-sm"
                  onChange={(e) => setAccentColor(e.target.value)}
                  type="text"
                  value={accentColor}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 font-semibold text-xl">About</h2>
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="bio"
              maxLength={2000}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell visitors about yourself and your photography..."
              rows={6}
              value={bio}
            />
            <p className="mt-1 text-gray-500 text-xs">
              {bio.length}/2000 characters
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 font-semibold text-xl">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full rounded border px-3 py-2"
                id="email"
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your@email.com"
                type="email"
                value={contactEmail}
              />
            </div>
            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                className="w-full rounded border px-3 py-2"
                id="phone"
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                type="tel"
                value={contactPhone}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 font-semibold text-xl">Social Media</h2>
          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="instagram"
              >
                Instagram
              </label>
              <input
                className="w-full rounded border px-3 py-2"
                id="instagram"
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/username"
                type="url"
                value={instagram}
              />
            </div>
            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="facebook"
              >
                Facebook
              </label>
              <input
                className="w-full rounded border px-3 py-2"
                id="facebook"
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/username"
                type="url"
                value={facebook}
              />
            </div>
            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="twitter"
              >
                Twitter/X
              </label>
              <input
                className="w-full rounded border px-3 py-2"
                id="twitter"
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/username"
                type="url"
                value={twitter}
              />
            </div>
            <div>
              <label
                className="mb-1 block font-medium text-gray-700 text-sm"
                htmlFor="linkedin"
              >
                LinkedIn
              </label>
              <input
                className="w-full rounded border px-3 py-2"
                id="linkedin"
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                type="url"
                value={linkedin}
              />
            </div>
          </div>
        </div>

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
            disabled={isSubmitting || !subdomain}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
