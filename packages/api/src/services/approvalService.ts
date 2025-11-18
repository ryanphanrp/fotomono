import { db } from "@fotomono/db";
import { image, imageApproval, show } from "@fotomono/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { portfolioService } from "./portfolioService";

/**
 * Approval Service
 * Handles client approval workflow and link generation
 */
export class ApprovalService {
  /**
   * Create approval link for images
   * Generates a unique token and creates approval records
   */
  async createApprovalLink(
    userId: string,
    imageIds: string[],
    options: {
      expiresInDays?: number;
    } = {}
  ) {
    const { expiresInDays = 7 } = options;

    // Verify all images belong to user (via show)
    const images = await db
      .select()
      .from(image)
      .innerJoin(show, eq(image.showId, show.id))
      .where(and(inArray(image.id, imageIds), eq(show.userId, userId)));

    if (images.length !== imageIds.length) {
      throw new Error("Some images not found or unauthorized");
    }

    // Generate unique token
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create approval records for each image
    const approvals = await Promise.all(
      imageIds.map((imageId) =>
        db
          .insert(imageApproval)
          .values({
            id: nanoid(),
            imageId,
            status: "pending",
            approvalToken: token,
            approvalTokenExpiresAt: expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()
      )
    );

    return {
      token,
      expiresAt,
      imageCount: approvals.length,
    };
  }

  /**
   * Get images pending approval by token (public access)
   * Validates token and expiration
   */
  async getByToken(token: string) {
    // Get all approval records for this token
    const approvals = await db
      .select({
        id: imageApproval.id,
        imageId: imageApproval.imageId,
        status: imageApproval.status,
        expiresAt: imageApproval.approvalTokenExpiresAt,
        clientFeedback: imageApproval.clientFeedback,
        // Image details
        filename: image.filename,
        thumbnailSmallUrl: image.thumbnailSmallUrl,
        thumbnailMediumUrl: image.thumbnailMediumUrl,
        thumbnailLargeUrl: image.thumbnailLargeUrl,
        url: image.url,
        width: image.width,
        height: image.height,
      })
      .from(imageApproval)
      .innerJoin(image, eq(imageApproval.imageId, image.id))
      .where(eq(imageApproval.approvalToken, token));

    if (!approvals || approvals.length === 0) {
      throw new Error("Approval link not found");
    }

    // Check if token is expired
    const expiresAt = approvals[0].expiresAt;
    if (expiresAt && expiresAt < new Date()) {
      throw new Error("Approval link has expired");
    }

    return approvals;
  }

  /**
   * Approve an image
   * Marks as approved and optionally adds to portfolio
   */
  async approve(
    token: string,
    imageId: string,
    options: {
      feedback?: string;
      addToPortfolio?: boolean;
    } = {}
  ) {
    const { feedback, addToPortfolio = true } = options;

    // Verify token and get approval record
    const approval = await db
      .select()
      .from(imageApproval)
      .where(
        and(
          eq(imageApproval.approvalToken, token),
          eq(imageApproval.imageId, imageId)
        )
      )
      .limit(1);

    if (!approval || approval.length === 0) {
      throw new Error("Approval record not found");
    }

    // Check if token is expired
    if (
      approval[0].approvalTokenExpiresAt &&
      approval[0].approvalTokenExpiresAt < new Date()
    ) {
      throw new Error("Approval link has expired");
    }

    // Check if already processed
    if (approval[0].status !== "pending") {
      throw new Error(`Image already ${approval[0].status}`);
    }

    // Update approval record
    const updated = await db
      .update(imageApproval)
      .set({
        status: "approved",
        clientApprovedAt: new Date(),
        clientFeedback: feedback || null,
        updatedAt: new Date(),
      })
      .where(eq(imageApproval.id, approval[0].id))
      .returning();

    // Add to portfolio if requested
    if (addToPortfolio) {
      // Get userId from image via show
      const imageData = await db
        .select({ userId: show.userId })
        .from(image)
        .innerJoin(show, eq(image.showId, show.id))
        .where(eq(image.id, imageId))
        .limit(1);

      if (imageData && imageData.length > 0) {
        try {
          await portfolioService.addImageToPortfolio(
            imageData[0].userId,
            imageId
          );
        } catch (error) {
          // Ignore if already in portfolio
          if (
            error instanceof Error &&
            error.message !== "Image already in portfolio"
          ) {
            throw error;
          }
        }
      }
    }

    return updated[0];
  }

  /**
   * Reject an image
   */
  async reject(
    token: string,
    imageId: string,
    options: {
      feedback?: string;
    } = {}
  ) {
    const { feedback } = options;

    // Verify token and get approval record
    const approval = await db
      .select()
      .from(imageApproval)
      .where(
        and(
          eq(imageApproval.approvalToken, token),
          eq(imageApproval.imageId, imageId)
        )
      )
      .limit(1);

    if (!approval || approval.length === 0) {
      throw new Error("Approval record not found");
    }

    // Check if token is expired
    if (
      approval[0].approvalTokenExpiresAt &&
      approval[0].approvalTokenExpiresAt < new Date()
    ) {
      throw new Error("Approval link has expired");
    }

    // Check if already processed
    if (approval[0].status !== "pending") {
      throw new Error(`Image already ${approval[0].status}`);
    }

    // Update approval record
    const updated = await db
      .update(imageApproval)
      .set({
        status: "rejected",
        clientRejectedAt: new Date(),
        clientFeedback: feedback || null,
        updatedAt: new Date(),
      })
      .where(eq(imageApproval.id, approval[0].id))
      .returning();

    return updated[0];
  }

  /**
   * Get approval status for images
   */
  async getApprovalStatus(userId: string, imageIds: string[]) {
    // Verify images belong to user
    const images = await db
      .select({ imageId: image.id })
      .from(image)
      .innerJoin(show, eq(image.showId, show.id))
      .where(and(inArray(image.id, imageIds), eq(show.userId, userId)));

    if (images.length !== imageIds.length) {
      throw new Error("Some images not found or unauthorized");
    }

    // Get approval status
    const approvals = await db
      .select({
        imageId: imageApproval.imageId,
        status: imageApproval.status,
        approvalToken: imageApproval.approvalToken,
        expiresAt: imageApproval.approvalTokenExpiresAt,
        clientApprovedAt: imageApproval.clientApprovedAt,
        clientRejectedAt: imageApproval.clientRejectedAt,
        clientFeedback: imageApproval.clientFeedback,
      })
      .from(imageApproval)
      .where(inArray(imageApproval.imageId, imageIds));

    return approvals;
  }

  /**
   * Delete approval records (cleanup)
   */
  async deleteApprovalRecords(userId: string, imageIds: string[]) {
    // Verify images belong to user
    const images = await db
      .select({ imageId: image.id })
      .from(image)
      .innerJoin(show, eq(image.showId, show.id))
      .where(and(inArray(image.id, imageIds), eq(show.userId, userId)));

    if (images.length !== imageIds.length) {
      throw new Error("Some images not found or unauthorized");
    }

    // Delete approval records
    await db
      .delete(imageApproval)
      .where(inArray(imageApproval.imageId, imageIds));

    return { success: true };
  }
}

/**
 * Singleton instance
 */
export const approvalService = new ApprovalService();
