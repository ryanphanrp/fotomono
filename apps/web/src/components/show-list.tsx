"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
	shootTypeEnum,
	showStatusEnum,
	type ShowStatus,
	type ShootType,
} from "@fotomono/api/schemas/show";
import { Calendar, MapPin, User, DollarSign, Trash2, Edit, Eye } from "lucide-react";

interface ShowListProps {
	onShowClick?: (showId: string) => void;
}

export default function ShowList({ onShowClick }: ShowListProps) {
	const router = useRouter();
	const [filters, setFilters] = useState({
		status: undefined as ShowStatus | undefined,
		shootType: undefined as ShootType | undefined,
		search: "",
		limit: 50,
		offset: 0,
	});

	// Fetch shows
	const { data, isLoading, error, refetch } = trpc.shows.list.useQuery(filters, {
		refetchOnWindowFocus: false,
	});

	// Delete mutation
	const deleteMutation = trpc.shows.delete.useMutation({
		onSuccess: () => {
			toast.success("Show deleted successfully!");
			refetch();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete show");
		},
	});

	const handleDelete = (id: string, title: string) => {
		if (confirm(`Are you sure you want to delete "${title}"?`)) {
			deleteMutation.mutate({ id });
		}
	};

	const handleEdit = (id: string) => {
		router.push(`/dashboard/shows/${id}`);
	};

	const handleView = (id: string) => {
		if (onShowClick) {
			onShowClick(id);
		} else {
			router.push(`/dashboard/shows/${id}`);
		}
	};

	const getStatusBadgeClass = (status: string) => {
		const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
		switch (status) {
			case "pending":
				return `${baseClass} bg-yellow-100 text-yellow-800`;
			case "confirmed":
				return `${baseClass} bg-blue-100 text-blue-800`;
			case "completed":
				return `${baseClass} bg-green-100 text-green-800`;
			case "delivered":
				return `${baseClass} bg-purple-100 text-purple-800`;
			case "cancelled":
				return `${baseClass} bg-red-100 text-red-800`;
			default:
				return `${baseClass} bg-gray-100 text-gray-800`;
		}
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="space-y-6">
			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Filter Shows</CardTitle>
					<CardDescription>Search and filter your photography sessions</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{/* Search */}
						<div className="space-y-2">
							<Label htmlFor="search">Search</Label>
							<Input
								id="search"
								placeholder="Client name or title..."
								value={filters.search}
								onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							/>
						</div>

						{/* Status Filter */}
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<select
								id="status"
								value={filters.status || ""}
								onChange={(e) =>
									setFilters({
										...filters,
										status: e.target.value ? (e.target.value as ShowStatus) : undefined,
									})
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="">All Statuses</option>
								{showStatusEnum.options.map((status) => (
									<option key={status} value={status}>
										{status.charAt(0).toUpperCase() + status.slice(1)}
									</option>
								))}
							</select>
						</div>

						{/* Shoot Type Filter */}
						<div className="space-y-2">
							<Label htmlFor="shootType">Shoot Type</Label>
							<select
								id="shootType"
								value={filters.shootType || ""}
								onChange={(e) =>
									setFilters({
										...filters,
										shootType: e.target.value ? (e.target.value as ShootType) : undefined,
									})
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="">All Types</option>
								{shootTypeEnum.options.map((type) => (
									<option key={type} value={type}>
										{type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
									</option>
								))}
							</select>
						</div>

						{/* Clear Filters */}
						<div className="flex items-end">
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									setFilters({
										status: undefined,
										shootType: undefined,
										search: "",
										limit: 50,
										offset: 0,
									})
								}
								className="w-full"
							>
								Clear Filters
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Shows List */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Shows</CardTitle>
						<CardDescription>
							{data?.total || 0} show{data?.total !== 1 ? "s" : ""} found
						</CardDescription>
					</div>
					<Button onClick={() => router.push("/dashboard/shows/new")}>Create New Show</Button>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="text-center py-8 text-gray-500">Loading shows...</div>
					) : error ? (
						<div className="text-center py-8 text-red-500">
							Error loading shows: {error.message}
						</div>
					) : !data?.shows || data.shows.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<p className="mb-4">No shows found</p>
							<Button onClick={() => router.push("/dashboard/shows/new")}>
								Create Your First Show
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{data.shows.map((show) => (
								<div
									key={show.id}
									className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
								>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											{/* Title and Status */}
											<div className="flex items-center gap-3 mb-2">
												<h3 className="text-lg font-semibold">{show.title}</h3>
												<span className={getStatusBadgeClass(show.status)}>
													{show.status}
												</span>
											</div>

											{/* Client Info */}
											<div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
												<User className="w-4 h-4" />
												<span>{show.clientName}</span>
												{show.clientEmail && (
													<>
														<span>•</span>
														<span>{show.clientEmail}</span>
													</>
												)}
											</div>

											{/* Details Grid */}
											<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
												{/* Date */}
												<div className="flex items-center gap-2">
													<Calendar className="w-4 h-4" />
													<span>{formatDate(show.dateStart)}</span>
												</div>

												{/* Location */}
												{show.location && (
													<div className="flex items-center gap-2">
														<MapPin className="w-4 h-4" />
														<span className="truncate">{show.location}</span>
													</div>
												)}

												{/* Pricing */}
												{show.pricing && (
													<div className="flex items-center gap-2">
														<DollarSign className="w-4 h-4" />
														<span>
															{show.currency} {show.pricing}
														</span>
													</div>
												)}
											</div>

											{/* Shoot Type */}
											<div className="mt-2">
												<span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
													{show.shootType.charAt(0).toUpperCase() +
														show.shootType.slice(1).replace("_", " ")}
												</span>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex gap-2 ml-4">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleView(show.id)}
												title="View details"
											>
												<Eye className="w-4 h-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleEdit(show.id)}
												title="Edit show"
											>
												<Edit className="w-4 h-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleDelete(show.id, show.title)}
												disabled={deleteMutation.isPending}
												title="Delete show"
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
