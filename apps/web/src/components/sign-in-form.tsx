"use client";

import { loginSchema } from "@fotomono/api/schemas/auth";
import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get callback URL from query params (set by middleware)
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Use tRPC mutation for login
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Welcome back!");
      router.push(callbackUrl);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
    validators: {
      onSubmit: loginSchema,
    },
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-center font-bold text-2xl">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your FotoMono account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {/* Email Field */}
            <div>
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      disabled={loginMutation.isPending}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Password Field */}
            <div>
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      disabled={loginMutation.isPending}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      type="password"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Remember Me Checkbox */}
            <div>
              <form.Field name="rememberMe">
                {(field) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.state.value}
                      disabled={loginMutation.isPending}
                      id={field.name}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked as boolean)
                      }
                    />
                    <Label
                      className="cursor-pointer font-normal text-sm"
                      htmlFor={field.name}
                    >
                      Remember me for 7 days
                    </Label>
                  </div>
                )}
              </form.Field>
            </div>

            {/* Submit Button */}
            <form.Subscribe>
              {(state) => (
                <Button
                  className="w-full"
                  disabled={
                    !state.canSubmit ||
                    state.isSubmitting ||
                    loginMutation.isPending
                  }
                  type="submit"
                >
                  {loginMutation.isPending || state.isSubmitting
                    ? "Signing in..."
                    : "Sign In"}
                </Button>
              )}
            </form.Subscribe>
          </form>

          {/* Forgot Password Link - Phase 2 */}
          <div className="mt-4 text-center">
            <Button
              className="h-auto p-0 text-gray-600 text-sm hover:text-gray-800"
              disabled
              variant="link"
            >
              Forgot password? (Coming soon)
            </Button>
          </div>

          {/* Switch to Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Button
                className="h-auto p-0 font-semibold text-primary hover:underline"
                disabled={loginMutation.isPending}
                onClick={onSwitchToSignUp}
                variant="link"
              >
                Sign Up
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
