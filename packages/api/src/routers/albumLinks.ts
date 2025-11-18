import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../index";
import {
  createAlbumLinkSchema,
  deleteLinkSchema,
  getByTokenSchema,
  getImageDownloadUrlSchema,
  getLinkStatsSchema,
  listLinksSchema,
  updateLinkSchema,
} from "../schemas/albumLink";
import { albumLinkService } from "../services/albumLinkService";

/**
 * Album Links router
 * Handles shareable link generation and public access
 */
export const albumLinksRouter = router({
  /**
   * Create shareable link (protected)
   */
  create: protectedProcedure
    .input(createAlbumLinkSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const link = await albumLinkService.createLink(userId, input.albumId, {
          expirationDate: input.expirationDate,
          allowDownload: input.allowDownload,
        });

        return {
          success: true,
          message: "Album link created successfully",
          link,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Album not found or unauthorized"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        console.error("Create album link error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create album link",
        });
      }
    }),

  /**
   * Get album by token (public)
   */
  getByToken: publicProcedure
    .input(getByTokenSchema)
    .query(async ({ input }) => {
      try {
        const albumData = await albumLinkService.getByToken(input.token);

        return albumData;
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message === "Album link not found" ||
            error.message === "Album link is deactivated" ||
            error.message === "Album link has expired")
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: error.message,
          });
        }

        console.error("Get album by token error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch album",
        });
      }
    }),

  /**
   * List all links for album (protected)
   */
  list: protectedProcedure
    .input(listLinksSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const links = await albumLinkService.listLinks(userId, input.albumId);

        return {
          links,
          total: links.length,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Album not found or unauthorized"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: error.message,
          });
        }

        console.error("List album links error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch album links",
        });
      }
    }),

  /**
   * Update link settings (protected)
   */
  update: protectedProcedure
    .input(updateLinkSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const link = await albumLinkService.updateLink(userId, input.linkId, {
          expirationDate: input.expirationDate,
          allowDownload: input.allowDownload,
          isActive: input.isActive,
        });

        return {
          success: true,
          message: "Link updated successfully",
          link,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Link not found or unauthorized"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: error.message,
          });
        }

        console.error("Update link error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update link",
        });
      }
    }),

  /**
   * Deactivate link (protected)
   */
  delete: protectedProcedure
    .input(deleteLinkSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        await albumLinkService.deleteLink(userId, input.linkId);

        return {
          success: true,
          message: "Link deactivated successfully",
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Link not found or unauthorized"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: error.message,
          });
        }

        console.error("Delete link error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to deactivate link",
        });
      }
    }),

  /**
   * Get link analytics (protected)
   */
  getStats: protectedProcedure
    .input(getLinkStatsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const stats = await albumLinkService.getLinkStats(
          userId,
          input.albumId
        );

        return {
          links: stats,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Album not found or unauthorized"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: error.message,
          });
        }

        console.error("Get link stats error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch link stats",
        });
      }
    }),

  /**
   * Get image download URL (public)
   */
  getImageDownloadUrl: publicProcedure
    .input(getImageDownloadUrlSchema)
    .query(async ({ input }) => {
      try {
        const downloadData = await albumLinkService.getImageDownloadUrl(
          input.token,
          input.imageId
        );

        return downloadData;
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message === "Album link not found" ||
            error.message === "Album link is deactivated" ||
            error.message === "Album link has expired" ||
            error.message === "Download is not allowed for this album" ||
            error.message === "Image not found in album")
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        console.error("Get image download URL error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get download URL",
        });
      }
    }),
});

export type AlbumLinksRouter = typeof albumLinksRouter;
