"use client";

import { useForm } from "@tanstack/react-form";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
	createShowSchema,
	shootTypeEnum,
	type CreateShowInput,
	type ShowStatus,
} from "@fotomono/api/schemas/show";

interface ShowFormProps {
	initialData?: {
		id?: string;
		title: string;
		clientName: string;
		clientEmail?: string;
		clientPhone?: string;
		shootType: string;
		location?: string;
		dateStart: Date;
		dateEnd: Date;
		pricing?: string | number;
		currency?: string;
		notes?: string;
		status?: ShowStatus;
	};
	onSuccess?: () => void;
	onCancel?: () => void;
}

export default function ShowForm({ initialData, onSuccess, onCancel }: ShowFormProps) {
	const router = useRouter();
	const isEditing = !!initialData?.id;

	// Create mutation
	const createMutation = trpc.shows.create.useMutation({
		onSuccess: () => {
			toast.success("Show created successfully!");
			onSuccess?.() || router.push("/dashboard/shows");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create show");
		},
	});

	// Update mutation
	const updateMutation = trpc.shows.update.useMutation({
		onSuccess: () => {
			toast.success("Show updated successfully!");
			onSuccess?.() || router.push("/dashboard/shows");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update show");
		},
	});

	const form = useForm({
		defaultValues: {
			title: initialData?.title || "",
			clientName: initialData?.clientName || "",
			clientEmail: initialData?.clientEmail || "",
			clientPhone: initialData?.clientPhone || "",
			shootType: (initialData?.shootType as any) || "wedding",
			location: initialData?.location || "",
			dateStart: initialData?.dateStart || new Date(),
			dateEnd: initialData?.dateEnd || new Date(),
			pricing: initialData?.pricing?.toString() || "",
			currency: initialData?.currency || "USD",
			notes: initialData?.notes || "",
		},
		onSubmit: async ({ value }) => {
			try {
				const submitData = {
					...value,
					dateStart: new Date(value.dateStart),
					dateEnd: new Date(value.dateEnd),
					pricing: value.pricing || undefined,
					clientEmail: value.clientEmail || undefined,
					clientPhone: value.clientPhone || undefined,
					location: value.location || undefined,
					notes: value.notes || undefined,
				};

				if (isEditing && initialData.id) {
					updateMutation.mutate({
						id: initialData.id,
						...submitData,
					});
				} else {
					createMutation.mutate(submitData as CreateShowInput);
				}
			} catch (error) {
				console.error("Form submission error:", error);
			}
		},
		validators: {
			onSubmit: createShowSchema,
		},
	});

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{isEditing ? "Edit Show" : "Create New Show"}</CardTitle>
				<CardDescription>
					{isEditing
						? "Update the details of your photography session"
						: "Schedule a new photography session with client details"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-6"
				>
					{/* Title */}
					<form.Field name="title">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>
									Show Title <span className="text-red-500">*</span>
								</Label>
								<Input
									id={field.name}
									name={field.name}
									placeholder="e.g., Wedding - Smith & Johnson"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={isPending}
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-500">
										{field.state.meta.errors[0]?.message}
									</p>
								)}
							</div>
						)}
					</form.Field>

					{/* Client Details Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Client Name */}
						<form.Field name="clientName">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>
										Client Name <span className="text-red-500">*</span>
									</Label>
									<Input
										id={field.name}
										name={field.name}
										placeholder="John & Jane Smith"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-sm text-red-500">
											{field.state.meta.errors[0]?.message}
										</p>
									)}
								</div>
							)}
						</form.Field>

						{/* Client Email */}
						<form.Field name="clientEmail">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Client Email</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										placeholder="client@example.com"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
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

					{/* Client Phone & Shoot Type Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Client Phone */}
						<form.Field name="clientPhone">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Client Phone</Label>
									<Input
										id={field.name}
										name={field.name}
										type="tel"
										placeholder="+1 (555) 123-4567"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
									/>
								</div>
							)}
						</form.Field>

						{/* Shoot Type */}
						<form.Field name="shootType">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>
										Shoot Type <span className="text-red-500">*</span>
									</Label>
									<select
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
										className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
									>
										{shootTypeEnum.options.map((type) => (
											<option key={type} value={type}>
												{type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
											</option>
										))}
									</select>
								</div>
							)}
						</form.Field>
					</div>

					{/* Location */}
					<form.Field name="location">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Location</Label>
								<Input
									id={field.name}
									name={field.name}
									placeholder="123 Wedding Venue St, City, State"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={isPending}
								/>
							</div>
						)}
					</form.Field>

					{/* Date & Time Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Start Date */}
						<form.Field name="dateStart">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>
										Start Date & Time <span className="text-red-500">*</span>
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="datetime-local"
										value={
											field.state.value instanceof Date
												? field.state.value.toISOString().slice(0, 16)
												: ""
										}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(new Date(e.target.value))}
										disabled={isPending}
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-sm text-red-500">
											{field.state.meta.errors[0]?.message}
										</p>
									)}
								</div>
							)}
						</form.Field>

						{/* End Date */}
						<form.Field name="dateEnd">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>
										End Date & Time <span className="text-red-500">*</span>
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="datetime-local"
										value={
											field.state.value instanceof Date
												? field.state.value.toISOString().slice(0, 16)
												: ""
										}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(new Date(e.target.value))}
										disabled={isPending}
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

					{/* Pricing Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Pricing */}
						<form.Field name="pricing">
							{(field) => (
								<div className="space-y-2 md:col-span-2">
									<Label htmlFor={field.name}>Pricing</Label>
									<Input
										id={field.name}
										name={field.name}
										type="number"
										step="0.01"
										placeholder="2500.00"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
									/>
								</div>
							)}
						</form.Field>

						{/* Currency */}
						<form.Field name="currency">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Currency</Label>
									<Input
										id={field.name}
										name={field.name}
										placeholder="USD"
										maxLength={3}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
										disabled={isPending}
									/>
								</div>
							)}
						</form.Field>
					</div>

					{/* Notes */}
					<form.Field name="notes">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Notes</Label>
								<textarea
									id={field.name}
									name={field.name}
									placeholder="Special requirements, equipment needed, etc..."
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={isPending}
									rows={4}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
						)}
					</form.Field>

					{/* Action Buttons */}
					<div className="flex gap-3 justify-end pt-4">
						{onCancel && (
							<Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
								Cancel
							</Button>
						)}
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									disabled={!state.canSubmit || state.isSubmitting || isPending}
								>
									{isPending
										? isEditing
											? "Updating..."
											: "Creating..."
										: isEditing
											? "Update Show"
											: "Create Show"}
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
