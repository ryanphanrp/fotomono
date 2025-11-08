import { protectedProcedure, publicProcedure, router } from "../index";
import { authRouter } from "./auth";

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
});

export type AppRouter = typeof appRouter;
