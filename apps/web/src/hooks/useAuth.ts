"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

/**
 * useAuth Hook
 *
 * Provides authentication state and methods for client components
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, isLoading, logout } = useAuth();
 *
 * if (isLoading) return <Loader />;
 * if (!isAuthenticated) return <Login />;
 *
 * return <div>Welcome {user.name}</div>;
 * ```
 */
export function useAuth() {
  const router = useRouter();

  // Get session data using tRPC
  const {
    data: sessionData,
    isLoading,
    error,
    refetch,
  } = trpc.auth.getSession.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Logout mutation
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/login");
      // Refetch session to update state
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to logout");
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    // User data
    user: sessionData?.user || null,
    session: sessionData?.session || null,

    // Authentication state
    isAuthenticated: sessionData?.isAuthenticated,
    isLoading,
    error,

    // Methods
    logout,
    refetch,

    // Mutation states
    isLoggingOut: logoutMutation.isPending,
  };
}

/**
 * useSession Hook
 *
 * Simplified hook that only returns session data
 * Use this when you only need user information without logout functionality
 *
 * @example
 * ```tsx
 * const { user, isLoading } = useSession();
 * ```
 */
export function useSession() {
  const { data, isLoading, error } = trpc.auth.getSession.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    isAuthenticated: data?.isAuthenticated,
    isLoading,
    error,
  };
}

/**
 * useRequireAuth Hook
 *
 * Redirects to login if user is not authenticated
 * Use this in protected pages/components
 *
 * @example
 * ```tsx
 * export default function ProtectedPage() {
 *   const { user, isLoading } = useRequireAuth();
 *
 *   if (isLoading) return <Loader />;
 *
 *   return <div>Protected content for {user.name}</div>;
 * }
 * ```
 */
export function useRequireAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSession();

  // Redirect to login if not authenticated (after loading completes)
  if (!(isLoading || isAuthenticated)) {
    router.push("/login");
  }

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
