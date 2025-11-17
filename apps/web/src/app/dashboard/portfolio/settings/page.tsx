"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
		null,
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
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Portfolio Settings</h1>
				<p className="text-gray-600 mt-1">
					Customize your public portfolio website
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Subdomain */}
				<div className="bg-white rounded-lg border p-6">
					<h2 className="text-xl font-semibold mb-4">Your Portfolio URL</h2>
					<div>
						<label
							htmlFor="subdomain"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Subdomain *
						</label>
						<div className="flex items-center gap-2">
							<input
								id="subdomain"
								type="text"
								value={subdomain}
								onChange={(e) => {
									const value = e.target.value.toLowerCase();
									setSubdomain(value);
									checkSubdomain(value);
								}}
								placeholder="yourname"
								required
								pattern="[a-z0-9-]+"
								className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<span className="text-gray-600">.fotomono.com</span>
						</div>
						{subdomainAvailable === true && (
							<p className="text-xs text-green-600 mt-1">✓ Available</p>
						)}
						{subdomainAvailable === false && (
							<p className="text-xs text-red-600 mt-1">✗ Already taken</p>
						)}
					</div>
				</div>

				{/* Theme */}
				<div className="bg-white rounded-lg border p-6">
					<h2 className="text-xl font-semibold mb-4">Theme</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{themes.map((t) => (
							<button
								key={t.id}
								type="button"
								onClick={() => setTheme(t.id)}
								className={`p-4 border-2 rounded-lg text-left transition-colors ${
									theme === t.id
										? "border-blue-500 bg-blue-50"
										: "border-gray-200 hover:border-gray-300"
								}`}
							>
								<h3 className="font-semibold mb-1">{t.name}</h3>
								<p className="text-xs text-gray-600">{t.description}</p>
							</button>
						))}
					</div>
				</div>

				{/* Colors */}
				<div className="bg-white rounded-lg border p-6">
					<h2 className="text-xl font-semibold mb-4">Colors</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="primaryColor"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Primary Color
							</label>
							<div className="flex items-center gap-2">
								<input
									id="primaryColor"
									type="color"
									value={primaryColor}
									onChange={(e) => setPrimaryColor(e.target.value)}
									className="h-10 w-20 border rounded cursor-pointer"
								/>
								<input
									type="text"
									value={primaryColor}
									onChange={(e) => setPrimaryColor(e.target.value)}
									className="flex-1 border rounded px-3 py-2 font-mono text-sm"
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor="accentColor"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Accent Color
							</label>
							<div className="flex items-center gap-2">
								<input
									id="accentColor"
									type="color"
									value={accentColor}
									onChange={(e) => setAccentColor(e.target.value)}
									className="h-10 w-20 border rounded cursor-pointer"
								/>
								<input
									type="text"
									value={accentColor}
									onChange={(e) => setAccentColor(e.target.value)}
									className="flex-1 border rounded px-3 py-2 font-mono text-sm"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Bio */}
				<div className="bg-white rounded-lg border p-6">
					<h2 className="text-xl font-semibold mb-4">About</h2>
					<div>
						<label
							htmlFor="bio"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Bio
						</label>
						<textarea
							id="bio"
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							placeholder="Tell visitors about yourself and your photography..."
							rows={6}
							maxLength={2000}
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<p className="text-xs text-gray-500 mt-1">
							{bio.length}/2000 characters
						</p>
					</div>
				</div>

				{/* Contact */}
				<div className="bg-white rounded-lg border p-6">
					<h2 className="text-xl font-semibold mb-4">Contact Information</h2>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								value={contactEmail}
								onChange={(e) => setContactEmail(e.target.value)}
								placeholder="your@email.com"
								className="w-full border rounded px-3 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="phone"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Phone
							</label>
							<input
								id="phone"
								type="tel"
								value={contactPhone}
								onChange={(e) => setContactPhone(e.target.value)}
								placeholder="+1 (555) 000-0000"
								className="w-full border rounded px-3 py-2"
							/>
						</div>
					</div>
				</div>

				{/* Social Links */}
				<div className="bg-white rounded-lg border p-6">
					<h2 className="text-xl font-semibold mb-4">Social Media</h2>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="instagram"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Instagram
							</label>
							<input
								id="instagram"
								type="url"
								value={instagram}
								onChange={(e) => setInstagram(e.target.value)}
								placeholder="https://instagram.com/username"
								className="w-full border rounded px-3 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="facebook"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Facebook
							</label>
							<input
								id="facebook"
								type="url"
								value={facebook}
								onChange={(e) => setFacebook(e.target.value)}
								placeholder="https://facebook.com/username"
								className="w-full border rounded px-3 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="twitter"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Twitter/X
							</label>
							<input
								id="twitter"
								type="url"
								value={twitter}
								onChange={(e) => setTwitter(e.target.value)}
								placeholder="https://twitter.com/username"
								className="w-full border rounded px-3 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="linkedin"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								LinkedIn
							</label>
							<input
								id="linkedin"
								type="url"
								value={linkedin}
								onChange={(e) => setLinkedin(e.target.value)}
								placeholder="https://linkedin.com/in/username"
								className="w-full border rounded px-3 py-2"
							/>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-3">
					<button
						type="button"
						onClick={() => router.back()}
						disabled={isSubmitting}
						className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting || !subdomain}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
					>
						{isSubmitting ? "Saving..." : "Save Settings"}
					</button>
				</div>
			</form>
		</div>
	);
}
