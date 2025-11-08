"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { loginSchema } from "@fotomono/api/schemas/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const router = useRouter();

	// Use tRPC mutation for login
	const loginMutation = trpc.auth.login.useMutation({
		onSuccess: (data) => {
			toast.success(data.message || "Welcome back!");
			router.push("/dashboard");
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
		<div className="mx-auto w-full mt-10 max-w-md">
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Welcome Back
					</CardTitle>
					<CardDescription className="text-center">
						Sign in to your FotoMono account
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
											disabled={loginMutation.isPending}
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
											disabled={loginMutation.isPending}
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

						{/* Remember Me Checkbox */}
						<div>
							<form.Field name="rememberMe">
								{(field) => (
									<div className="flex items-center space-x-2">
										<Checkbox
											id={field.name}
											checked={field.state.value}
											onCheckedChange={(checked) =>
												field.handleChange(checked as boolean)
											}
											disabled={loginMutation.isPending}
										/>
										<Label
											htmlFor={field.name}
											className="text-sm font-normal cursor-pointer"
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
									type="submit"
									className="w-full"
									disabled={
										!state.canSubmit ||
										state.isSubmitting ||
										loginMutation.isPending
									}
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
							variant="link"
							className="p-0 h-auto text-sm text-gray-600 hover:text-gray-800"
							disabled
						>
							Forgot password? (Coming soon)
						</Button>
					</div>

					{/* Switch to Sign Up */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Button
								variant="link"
								onClick={onSwitchToSignUp}
								className="p-0 h-auto font-semibold text-primary hover:underline"
								disabled={loginMutation.isPending}
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
