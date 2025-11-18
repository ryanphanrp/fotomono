import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../index";
import {
  approveImageSchema,
  createApprovalLinkSchema,
  deleteApprovalRecordsSchema,
  getApprovalStatusSchema,
  getByTokenSchema,
  rejectImageSchema,
} from "../schemas/approval";
import { approvalService } from "../services/approvalService";

/**
 * Approval router
 * Handles client approval workflow
 */
export const approvalRouter = router({
  /**
   * Create approval link for images (protected - photographer only)
   */
  createLink: protectedProcedure
    .input(createApprovalLinkSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const result = await approvalService.createApprovalLink(
          userId,
          input.imageIds,
          {
            expiresInDays: input.expiresInDays,
          }
        );

        return {
          success: true,
          message: "Approval link created successfully",
          token: result.token,
          expiresAt: result.expiresAt,
          imageCount: result.imageCount,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Some images not found or unauthorized"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        console.error("Create approval link error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create approval link",
        });
      }
    }),

  /**
   * Get images by approval token (public - client access)
   */
  getByToken: publicProcedure
    .input(getByTokenSchema)
    .query(async ({ input }) => {
      try {
        const images = await approvalService.getByToken(input.token);

        return {
          images,
          total: images.length,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message === "Approval link not found" ||
            error.message === "Approval link has expired")
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: error.message,
          });
        }

        console.error("Get by token error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch images for approval",
        });
      }
    }),

  /**
   * Approve image (public - client access)
   */
  approve: publicProcedure
    .input(approveImageSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await approvalService.approve(
          input.token,
          input.imageId,
          {
            feedback: input.feedback,
            addToPortfolio: input.addToPortfolio,
          }
        );

        return {
          success: true,
          message: "Image approved successfully",
          approval: result,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message === "Approval record not found" ||
            error.message === "Approval link has expired" ||
            error.message.startsWith("Image already"))
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        console.error("Approve image error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to approve image",
        });
      }
    }),

  /**
   * Reject image (public - client access)
   */
  reject: publicProcedure
    .input(rejectImageSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await approvalService.reject(
          input.token,
          input.imageId,
          {
            feedback: input.feedback,
          }
        );

        return {
          success: true,
          message: "Image rejected",
          approval: result,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message === "Approval record not found" ||
            error.message === "Approval link has expired" ||
            error.message.startsWith("Image already"))
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        console.error("Reject image error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reject image",
        });
      }
    }),

  /**
   * Get approval status for images (protected - photographer only)
   */
  getStatus: protectedProcedure
    .input(getApprovalStatusSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const approvals = await approvalService.getApprovalStatus(
          userId,
          input.imageIds
        );

        return {
          approvals,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Some images not found or unauthorized"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        console.error("Get approval status error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch approval status",
        });
      }
    }),

  /**
   * Delete approval records (protected - photographer only)
   */
  deleteRecords: protectedProcedure
    .input(deleteApprovalRecordsSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        await approvalService.deleteApprovalRecords(userId, input.imageIds);

        return {
          success: true,
          message: "Approval records deleted",
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Some images not found or unauthorized"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        console.error("Delete approval records error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete approval records",
        });
      }
    }),
});

export type ApprovalRouter = typeof approvalRouter;
