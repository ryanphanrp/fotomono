"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

type StorageProvider = "s3" | "r2" | "google-drive" | "nas";

export default function StorageConfigPage() {
	const [selectedProvider, setSelectedProvider] =
		useState<StorageProvider>("s3");
	const [isTestingConnection, setIsTestingConnection] = useState(false);

	const { data: configs, refetch } = trpc.storage.list.useQuery();
	const setConfig = trpc.storage.setConfig.useMutation();
	const testConnection = trpc.storage.testConnection.useMutation();

	const handleTestConnection = async (configId?: string) => {
		setIsTestingConnection(true);
		try {
			const result = await testConnection.mutateAsync({
				id: configId,
			});
			alert(result.message);
		} catch (error) {
			alert("Connection test failed");
		} finally {
			setIsTestingConnection(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const credentials: Record<string, string> = {};
		// Build credentials object based on provider type
		// This is a simplified version
		if (selectedProvider === "s3" || selectedProvider === "r2") {
			credentials.accessKeyId = formData.get("accessKeyId") as string;
			credentials.secretAccessKey = formData.get("secretAccessKey") as string;
		}

		try {
			await setConfig.mutateAsync({
				providerType: selectedProvider,
				providerName: formData.get("providerName") as string,
				bucketName: formData.get("bucketName") as string,
				region: formData.get("region") as string,
				isDefault: formData.get("isDefault") === "on",
				credentials: credentials as never,
			});
			alert("Storage configuration saved successfully");
			refetch();
		} catch (error) {
			alert("Failed to save configuration");
		}
	};

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<h1 className="text-3xl font-bold mb-6">Storage Configuration</h1>

			<div className="grid gap-6">
				{/* Existing Configurations */}
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">Active Configurations</h2>
					<div className="space-y-3">
						{configs?.configs.map((config) => (
							<div
								key={config.id}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div>
									<p className="font-medium">
										{config.providerName || config.providerType}
									</p>
									<p className="text-sm text-gray-500">
										{config.bucketName || "—"} • {config.providerType}
										{config.isDefault && (
											<span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
												Default
											</span>
										)}
									</p>
								</div>
								<button
									type="button"
									onClick={() => handleTestConnection(config.id)}
									disabled={isTestingConnection}
									className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
								>
									Test Connection
								</button>
							</div>
						))}
						{!configs?.configs.length && (
							<p className="text-gray-500 text-center py-4">
								No storage configurations yet
							</p>
						)}
					</div>
				</div>

				{/* Add New Configuration */}
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">
						Add Storage Configuration
					</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Provider Selection */}
						<div>
							<label className="block text-sm font-medium mb-2">
								Storage Provider
							</label>
							<div className="grid grid-cols-2 gap-3">
								{(["s3", "r2", "google-drive", "nas"] as const).map((provider) => (
									<label
										key={provider}
										className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
									>
										<input
											type="radio"
											name="provider"
											value={provider}
											checked={selectedProvider === provider}
											onChange={(e) =>
												setSelectedProvider(e.target.value as StorageProvider)
											}
											className="mr-2"
										/>
										<span className="capitalize">
											{provider === "r2" ? "Cloudflare R2" : provider}
										</span>
									</label>
								))}
							</div>
						</div>

						{/* Provider Name */}
						<div>
							<label className="block text-sm font-medium mb-2">
								Configuration Name
							</label>
							<input
								name="providerName"
								type="text"
								placeholder="My Storage"
								className="w-full px-3 py-2 border rounded"
							/>
						</div>

						{/* Conditional Fields Based on Provider */}
						{(selectedProvider === "s3" || selectedProvider === "r2") && (
							<>
								<div>
									<label className="block text-sm font-medium mb-2">
										Access Key ID
									</label>
									<input
										name="accessKeyId"
										type="text"
										required
										className="w-full px-3 py-2 border rounded"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Secret Access Key
									</label>
									<input
										name="secretAccessKey"
										type="password"
										required
										className="w-full px-3 py-2 border rounded"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Bucket Name
									</label>
									<input
										name="bucketName"
										type="text"
										required
										className="w-full px-3 py-2 border rounded"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Region
									</label>
									<input
										name="region"
										type="text"
										placeholder="us-east-1"
										defaultValue={selectedProvider === "r2" ? "auto" : ""}
										className="w-full px-3 py-2 border rounded"
									/>
								</div>
							</>
						)}

						{/* Set as Default */}
						<div className="flex items-center">
							<input
								name="isDefault"
								type="checkbox"
								className="mr-2"
								id="isDefault"
							/>
							<label htmlFor="isDefault" className="text-sm">
								Set as default storage
							</label>
						</div>

						{/* Submit */}
						<button
							type="submit"
							disabled={setConfig.isPending}
							className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
						>
							{setConfig.isPending ? "Saving..." : "Save Configuration"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
