"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { registerSchema } from "@fotomono/api/schemas/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

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
		<div className="mx-auto w-full mt-10 max-w-md">
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Create Account
					</CardTitle>
					<CardDescription className="text-center">
						Enter your details to get started with FotoMono
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
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
											id={field.name}
											name={field.name}
											placeholder="John Doe"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											disabled={registerMutation.isPending}
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="text-sm text-red-500">
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
											id={field.name}
											name={field.name}
											type="email"
											placeholder="you@example.com"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											disabled={registerMutation.isPending}
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="text-sm text-red-500">
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
											id={field.name}
											name={field.name}
											type="password"
											placeholder="••••••••"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											disabled={registerMutation.isPending}
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="text-sm text-red-500">
												{field.state.meta.errors[0]?.message}
											</p>
										)}
										<p className="text-xs text-gray-500">
											Must be at least 8 characters with uppercase, lowercase, and a
											number
										</p>
									</div>
								)}
							</form.Field>
						</div>

						{/* Submit Button */}
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									className="w-full"
									disabled={
										!state.canSubmit ||
										state.isSubmitting ||
										registerMutation.isPending
									}
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
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Button
								variant="link"
								onClick={onSwitchToSignIn}
								className="p-0 h-auto font-semibold text-primary hover:underline"
								disabled={registerMutation.isPending}
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
