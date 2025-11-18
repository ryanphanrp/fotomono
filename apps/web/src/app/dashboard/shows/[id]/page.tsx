"use client";

import {
  Calendar,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ShowForm from "@/components/show-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

export default function ShowDetailPage() {
  const router = useRouter();
  const params = useParams();
  const showId = params?.id as string;

  // Fetch show data
  const {
    data: show,
    isLoading,
    error,
  } = trpc.shows.getById.useQuery(
    { id: showId },
    { enabled: !!showId, refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="py-12 text-center">
          <div className="text-gray-500">Loading show details...</div>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="py-12 text-center">
          <div className="mb-4 text-red-500">
            {error?.message || "Show not found"}
          </div>
          <Button onClick={() => router.push("/dashboard/shows")}>
            Back to Shows
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "px-3 py-1 rounded-full text-sm font-medium inline-block";
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
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <button
          className="mb-4 flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900"
          onClick={() => router.back()}
        >
          ← Back to Shows
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-bold text-3xl">{show.title}</h1>
            <div className={getStatusBadgeClass(show.status)}>
              {show.status}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Show Details - Left Side */}
        <div className="space-y-6 lg:col-span-1">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-gray-500 text-sm">Name</div>
                  <div className="font-medium">{show.clientName}</div>
                </div>
              </div>
              {show.clientEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-gray-500 text-sm">Email</div>
                    <div className="font-medium">{show.clientEmail}</div>
                  </div>
                </div>
              )}
              {show.clientPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-gray-500 text-sm">Phone</div>
                    <div className="font-medium">{show.clientPhone}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-gray-500 text-sm">Start Time</div>
                  <div className="font-medium">
                    {formatDate(show.dateStart)}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-gray-500 text-sm">End Time</div>
                  <div className="font-medium">{formatDate(show.dateEnd)}</div>
                </div>
              </div>
              {show.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-gray-500 text-sm">Location</div>
                    <div className="font-medium">{show.location}</div>
                  </div>
                </div>
              )}
              <div>
                <div className="mb-1 text-gray-500 text-sm">Shoot Type</div>
                <span className="rounded bg-gray-100 px-2 py-1 text-gray-700 text-xs">
                  {show.shootType.charAt(0).toUpperCase() +
                    show.shootType.slice(1).replace("_", " ")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          {show.pricing && (
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-gray-500 text-sm">Amount</div>
                    <div className="font-medium text-lg">
                      {show.currency} {show.pricing}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {show.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div className="whitespace-pre-wrap text-sm">
                    {show.notes}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Form - Right Side */}
        <div className="lg:col-span-2">
          <ShowForm
            initialData={{
              id: show.id,
              title: show.title,
              clientName: show.clientName,
              clientEmail: show.clientEmail || undefined,
              clientPhone: show.clientPhone || undefined,
              shootType: show.shootType,
              location: show.location || undefined,
              dateStart: new Date(show.dateStart),
              dateEnd: new Date(show.dateEnd),
              pricing: show.pricing || undefined,
              currency: show.currency,
              notes: show.notes || undefined,
              status: show.status,
            }}
            onCancel={() => router.back()}
            onSuccess={() => router.push("/dashboard/shows")}
          />
        </div>
      </div>
    </div>
  );
}
