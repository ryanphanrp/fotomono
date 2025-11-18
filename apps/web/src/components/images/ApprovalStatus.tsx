interface ApprovalStatusProps {
  status: "pending" | "approved" | "rejected" | null;
  expiresAt?: Date | null;
  clientFeedback?: string | null;
}

export function ApprovalStatus({
  status,
  expiresAt,
  clientFeedback,
}: ApprovalStatusProps) {
  if (!status) {
    return null;
  }

  const isExpired = expiresAt && expiresAt < new Date();

  return (
    <div className="inline-flex items-center gap-1">
      {status === "pending" && (
        <>
          <svg
            className="h-4 w-4 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Pending Approval</title>
            <path
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span className="text-xs text-yellow-700">
            {isExpired ? "Expired" : "Pending"}
          </span>
        </>
      )}

      {status === "approved" && (
        <>
          <svg
            className="h-4 w-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Approved</title>
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span className="text-green-700 text-xs">Approved</span>
        </>
      )}

      {status === "rejected" && (
        <>
          <svg
            className="h-4 w-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Rejected</title>
            <path
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span className="text-red-700 text-xs">Rejected</span>
        </>
      )}

      {clientFeedback && (
        <div
          aria-label="Client feedback"
          className="ml-1 cursor-help"
          title={clientFeedback}
        >
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Has Feedback</title>
            <path
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
      )}
    </div>
  );
}
