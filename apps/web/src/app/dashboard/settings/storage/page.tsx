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
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 font-bold text-3xl">Storage Configuration</h1>

      <div className="grid gap-6">
        {/* Existing Configurations */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold text-xl">Active Configurations</h2>
          <div className="space-y-3">
            {configs?.configs.map((config) => (
              <div
                className="flex items-center justify-between rounded-lg border p-4"
                key={config.id}
              >
                <div>
                  <p className="font-medium">
                    {config.providerName || config.providerType}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {config.bucketName || "—"} • {config.providerType}
                    {config.isDefault && (
                      <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-blue-800 text-xs">
                        Default
                      </span>
                    )}
                  </p>
                </div>
                <button
                  className="rounded bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200 disabled:opacity-50"
                  disabled={isTestingConnection}
                  onClick={() => handleTestConnection(config.id)}
                  type="button"
                >
                  Test Connection
                </button>
              </div>
            ))}
            {!configs?.configs.length && (
              <p className="py-4 text-center text-gray-500">
                No storage configurations yet
              </p>
            )}
          </div>
        </div>

        {/* Add New Configuration */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold text-xl">
            Add Storage Configuration
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Provider Selection */}
            <div>
              <label className="mb-2 block font-medium text-sm">
                Storage Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["s3", "r2", "google-drive", "nas"] as const).map(
                  (provider) => (
                    <label
                      className="flex cursor-pointer items-center rounded border p-3 hover:bg-gray-50"
                      key={provider}
                    >
                      <input
                        checked={selectedProvider === provider}
                        className="mr-2"
                        name="provider"
                        onChange={(e) =>
                          setSelectedProvider(e.target.value as StorageProvider)
                        }
                        type="radio"
                        value={provider}
                      />
                      <span className="capitalize">
                        {provider === "r2" ? "Cloudflare R2" : provider}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Provider Name */}
            <div>
              <label className="mb-2 block font-medium text-sm">
                Configuration Name
              </label>
              <input
                className="w-full rounded border px-3 py-2"
                name="providerName"
                placeholder="My Storage"
                type="text"
              />
            </div>

            {/* Conditional Fields Based on Provider */}
            {(selectedProvider === "s3" || selectedProvider === "r2") && (
              <>
                <div>
                  <label className="mb-2 block font-medium text-sm">
                    Access Key ID
                  </label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    name="accessKeyId"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-medium text-sm">
                    Secret Access Key
                  </label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    name="secretAccessKey"
                    required
                    type="password"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-medium text-sm">
                    Bucket Name
                  </label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    name="bucketName"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-medium text-sm">
                    Region
                  </label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    defaultValue={selectedProvider === "r2" ? "auto" : ""}
                    name="region"
                    placeholder="us-east-1"
                    type="text"
                  />
                </div>
              </>
            )}

            {/* Set as Default */}
            <div className="flex items-center">
              <input
                className="mr-2"
                id="isDefault"
                name="isDefault"
                type="checkbox"
              />
              <label className="text-sm" htmlFor="isDefault">
                Set as default storage
              </label>
            </div>

            {/* Submit */}
            <button
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={setConfig.isPending}
              type="submit"
            >
              {setConfig.isPending ? "Saving..." : "Save Configuration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
