import { protectedProcedure, publicProcedure, router } from "../index";
import { authRouter } from "./auth";
import { showsRouter } from "./shows";
import { storageRouter } from "./storage";
import { imagesRouter } from "./images";

export const appRouter = router({
	// Health check
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),

	// Example protected route
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),

	// Authentication routes
	auth: authRouter,

	// Shows management routes
	shows: showsRouter,

	// Storage configuration routes
	storage: storageRouter,

	// Image management routes
	images: imagesRouter,
});

export type AppRouter = typeof appRouter;
