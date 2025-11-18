"use client";

import { useRouter } from "next/navigation";
import ShowForm from "@/components/show-form";

export default function NewShowPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <button
          className="mb-4 flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900"
          onClick={() => router.back()}
        >
          ← Back to Shows
        </button>
        <h1 className="mb-2 font-bold text-3xl">Create New Show</h1>
        <p className="text-gray-600">
          Schedule a new photography session with client details
        </p>
      </div>
      <ShowForm
        onCancel={() => router.back()}
        onSuccess={() => router.push("/dashboard/shows")}
      />
    </div>
  );
}
