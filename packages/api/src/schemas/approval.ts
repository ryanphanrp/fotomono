import { z } from "zod";

/**
 * Approval status enum
 */
export const approvalStatusEnum = z.enum(["pending", "approved", "rejected"]);

export type ApprovalStatus = z.infer<typeof approvalStatusEnum>;

/**
 * Create approval link
 */
export const createApprovalLinkSchema = z.object({
	imageIds: z
		.array(z.string())
		.min(1, "At least one image is required")
		.max(100, "Maximum 100 images per approval link"),
	expiresInDays: z
		.number()
		.int()
		.min(1, "Minimum 1 day")
		.max(30, "Maximum 30 days")
		.default(7)
		.optional(),
});

export type CreateApprovalLinkInput = z.infer<
	typeof createApprovalLinkSchema
>;

/**
 * Get images by approval token (public)
 */
export const getByTokenSchema = z.object({
	token: z.string().min(1, "Token is required"),
});

export type GetByTokenInput = z.infer<typeof getByTokenSchema>;

/**
 * Approve image
 */
export const approveImageSchema = z.object({
	token: z.string().min(1, "Token is required"),
	imageId: z.string().min(1, "Image ID is required"),
	feedback: z.string().max(1000).optional(),
	addToPortfolio: z.boolean().default(true).optional(),
});

export type ApproveImageInput = z.infer<typeof approveImageSchema>;

/**
 * Reject image
 */
export const rejectImageSchema = z.object({
	token: z.string().min(1, "Token is required"),
	imageId: z.string().min(1, "Image ID is required"),
	feedback: z.string().max(1000).optional(),
});

export type RejectImageInput = z.infer<typeof rejectImageSchema>;

/**
 * Get approval status
 */
export const getApprovalStatusSchema = z.object({
	imageIds: z.array(z.string()).min(1, "At least one image ID is required"),
});

export type GetApprovalStatusInput = z.infer<typeof getApprovalStatusSchema>;

/**
 * Delete approval records
 */
export const deleteApprovalRecordsSchema = z.object({
	imageIds: z.array(z.string()).min(1, "At least one image ID is required"),
});

export type DeleteApprovalRecordsInput = z.infer<
	typeof deleteApprovalRecordsSchema
>;
