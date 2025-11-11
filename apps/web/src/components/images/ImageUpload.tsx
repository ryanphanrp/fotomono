"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
	showId?: string;
	onUploadComplete?: (results: unknown[]) => void;
	maxFiles?: number;
	maxSize?: number; // in MB
}

export function ImageUpload({
	showId,
	onUploadComplete,
	maxFiles = 50,
	maxSize = 50,
}: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<
		Record<string, number>
	>({});
	const [files, setFiles] = useState<File[]>([]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles((prev) => [...prev, ...acceptedFiles]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [".jpg", ".jpeg"],
			"image/png": [".png"],
			"image/webp": [".webp"],
			"image/heic": [".heic"],
		},
		maxFiles,
		maxSize: maxSize * 1024 * 1024,
		multiple: true,
	});

	const handleUpload = async () => {
		if (!showId || files.length === 0) return;

		setUploading(true);
		const results = [];

		for (const file of files) {
			try {
				// Simulate upload progress
				setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

				// In a real implementation, this would call the tRPC mutation
				// with proper file handling (e.g., using FormData or base64)
				// For now, this is a placeholder
				await new Promise((resolve) => {
					const interval = setInterval(() => {
						setUploadProgress((prev) => {
							const current = prev[file.name] || 0;
							if (current >= 100) {
								clearInterval(interval);
								resolve(true);
								return prev;
							}
							return { ...prev, [file.name]: current + 10 };
						});
					}, 200);
				});

				results.push({ filename: file.name, success: true });
			} catch (error) {
				console.error(`Failed to upload ${file.name}:`, error);
				results.push({ filename: file.name, success: false, error });
			}
		}

		setUploading(false);
		setFiles([]);
		setUploadProgress({});
		onUploadComplete?.(results);
	};

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className="space-y-4">
			{/* Dropzone */}
			<div
				{...getRootProps()}
				className={`
					border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
					${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
				`}
			>
				<input {...getInputProps()} />
				<div className="space-y-2">
					<svg
						className="mx-auto h-12 w-12 text-gray-400"
						stroke="currentColor"
						fill="none"
						viewBox="0 0 48 48"
					>
						<title>Upload Icon</title>
						<path
							d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<div className="text-sm text-gray-600">
						{isDragActive ? (
							<p className="font-medium">Drop images here...</p>
						) : (
							<>
								<p className="font-medium">
									Drag and drop images here, or click to select
								</p>
								<p className="text-xs">
									Supports: JPEG, PNG, WEBP, HEIC (max {maxSize}MB per file)
								</p>
							</>
						)}
					</div>
				</div>
			</div>

			{/* File List */}
			{files.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<h3 className="font-medium">
							Selected Files ({files.length})
						</h3>
						<button
							type="button"
							onClick={() => setFiles([])}
							className="text-sm text-red-600 hover:text-red-700"
						>
							Clear All
						</button>
					</div>

					<div className="max-h-64 overflow-y-auto space-y-2">
						{files.map((file, index) => (
							<div
								key={`${file.name}-${index}`}
								className="flex items-center justify-between p-3 bg-gray-50 rounded border"
							>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">{file.name}</p>
									<p className="text-xs text-gray-500">
										{(file.size / 1024 / 1024).toFixed(2)} MB
									</p>
									{uploadProgress[file.name] !== undefined && (
										<div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
											<div
												className="bg-blue-600 h-1.5 rounded-full transition-all"
												style={{ width: `${uploadProgress[file.name]}%` }}
											/>
										</div>
									)}
								</div>
								{!uploading && (
									<button
										type="button"
										onClick={() => removeFile(index)}
										className="ml-3 text-red-600 hover:text-red-700"
									>
										<svg
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<title>Remove</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								)}
							</div>
						))}
					</div>

					{/* Upload Button */}
					<button
						type="button"
						onClick={handleUpload}
						disabled={uploading || !showId}
						className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{uploading ? "Uploading..." : "Upload Images"}
					</button>
				</div>
			)}
		</div>
	);
}
