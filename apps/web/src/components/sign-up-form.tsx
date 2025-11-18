"use client";

import { registerSchema } from "@fotomono/api/schemas/auth";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get callback URL from query params (set by middleware)
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Use tRPC mutation for registration
  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Account created successfully!");
      router.push(callbackUrl);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create account");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate(value);
    },
    validators: {
      onSubmit: registerSchema,
    },
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-center font-bold text-2xl">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started with FotoMono
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
            {/* Name Field */}
            <div>
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      disabled={registerMutation.isPending}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="John Doe"
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

            {/* Email Field */}
            <div>
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      disabled={registerMutation.isPending}
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
                      disabled={registerMutation.isPending}
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
                    <p className="text-gray-500 text-xs">
                      Must be at least 8 characters with uppercase, lowercase,
                      and a number
                    </p>
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
                    registerMutation.isPending
                  }
                  type="submit"
                >
                  {registerMutation.isPending || state.isSubmitting
                    ? "Creating account..."
                    : "Create Account"}
                </Button>
              )}
            </form.Subscribe>
          </form>

          {/* Switch to Sign In */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Button
                className="h-auto p-0 font-semibold text-primary hover:underline"
                disabled={registerMutation.isPending}
                onClick={onSwitchToSignIn}
                variant="link"
              >
                Sign In
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
