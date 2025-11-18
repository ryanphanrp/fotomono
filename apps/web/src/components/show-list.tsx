"use client";

import {
  type ShootType,
  type ShowStatus,
  shootTypeEnum,
  showStatusEnum,
} from "@fotomono/api/schemas/show";
import {
  Calendar,
  DollarSign,
  Edit,
  Eye,
  MapPin,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
  const { data, isLoading, error, refetch } = trpc.shows.list.useQuery(
    filters,
    {
      refetchOnWindowFocus: false,
    }
  );

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

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Shows</CardTitle>
          <CardDescription>
            Search and filter your photography sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Client name or title..."
                value={filters.search}
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                id="status"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value
                      ? (e.target.value as ShowStatus)
                      : undefined,
                  })
                }
                value={filters.status || ""}
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                id="shootType"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    shootType: e.target.value
                      ? (e.target.value as ShootType)
                      : undefined,
                  })
                }
                value={filters.shootType || ""}
              >
                <option value="">All Types</option>
                {shootTypeEnum.options.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={() =>
                  setFilters({
                    status: undefined,
                    shootType: undefined,
                    search: "",
                    limit: 50,
                    offset: 0,
                  })
                }
                type="button"
                variant="outline"
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
          <Button onClick={() => router.push("/dashboard/shows/new")}>
            Create New Show
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              Loading shows...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Error loading shows: {error.message}
            </div>
          ) : !data?.shows || data.shows.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p className="mb-4">No shows found</p>
              <Button onClick={() => router.push("/dashboard/shows/new")}>
                Create Your First Show
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.shows.map((show) => (
                <div
                  className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  key={show.id}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Title and Status */}
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{show.title}</h3>
                        <span className={getStatusBadgeClass(show.status)}>
                          {show.status}
                        </span>
                      </div>

                      {/* Client Info */}
                      <div className="mb-2 flex items-center gap-2 text-gray-600 text-sm">
                        <User className="h-4 w-4" />
                        <span>{show.clientName}</span>
                        {show.clientEmail && (
                          <>
                            <span>•</span>
                            <span>{show.clientEmail}</span>
                          </>
                        )}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 gap-2 text-gray-600 text-sm md:grid-cols-3">
                        {/* Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(show.dateStart)}</span>
                        </div>

                        {/* Location */}
                        {show.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{show.location}</span>
                          </div>
                        )}

                        {/* Pricing */}
                        {show.pricing && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>
                              {show.currency} {show.pricing}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Shoot Type */}
                      <div className="mt-2">
                        <span className="rounded bg-gray-100 px-2 py-1 text-gray-700 text-xs">
                          {show.shootType.charAt(0).toUpperCase() +
                            show.shootType.slice(1).replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="ml-4 flex gap-2">
                      <Button
                        onClick={() => handleView(show.id)}
                        size="sm"
                        title="View details"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleEdit(show.id)}
                        size="sm"
                        title="Edit show"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        className="text-red-600 hover:text-red-700"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDelete(show.id, show.title)}
                        size="sm"
                        title="Delete show"
                        variant="outline"
                      >
                        <Trash2 className="h-4 w-4" />
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
