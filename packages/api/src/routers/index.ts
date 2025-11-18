import { protectedProcedure, publicProcedure, router } from "../index";
import { albumLinksRouter } from "./albumLinks";
import { albumsRouter } from "./albums";
import { approvalRouter } from "./approval";
import { authRouter } from "./auth";
import { feedbackRouter } from "./feedback";
import { imagesRouter } from "./images";
import { portfolioRouter } from "./portfolio";
import { showsRouter } from "./shows";
import { storageRouter } from "./storage";

export const appRouter = router({
  // Health check
  healthCheck: publicProcedure.query(() => "OK"),

  // Example protected route
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),

  // Authentication routes
  auth: authRouter,

  // Shows management routes
  shows: showsRouter,

  // Storage configuration routes
  storage: storageRouter,

  // Image management routes
  images: imagesRouter,

  // Portfolio management routes
  portfolio: portfolioRouter,

  // Client approval routes
  approval: approvalRouter,

  // Client albums routes
  albums: albumsRouter,

  // Album links routes
  albumLinks: albumLinksRouter,

  // Client feedback routes
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
