import { auth } from "@fotomono/auth";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../index";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../schemas/auth";

/**
 * Authentication router
 * Handles user registration, login, logout, and session management
 */
export const authRouter = router({
  /**
   * Register a new user
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      try {
        // Create user with Better-Auth
        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
          },
        });

        if (!result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user account",
          });
        }

        return {
          success: true,
          message: "Account created successfully",
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
          },
        };
      } catch (error) {
        // Handle specific errors
        if (
          error instanceof Error &&
          (error.message.includes("duplicate") ||
            error.message.includes("already exists"))
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "An account with this email already exists",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account. Please try again.",
        });
      }
    }),

  /**
   * Login user
   */
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    try {
      const result = await auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
      });

      if (!result) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      return {
        success: true,
        message: "Login successful",
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
      };
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }
  }),

  /**
   * Logout user
   */
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await auth.api.signOut({
        headers: new Headers(),
      });

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to logout. Please try again.",
      });
    }
  }),

  /**
   * Get current session (me)
   */
  getSession: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    return {
      isAuthenticated: true,
      user: {
        id: ctx.session.user.id,
        email: ctx.session.user.email,
        name: ctx.session.user.name,
        image: ctx.session.user.image,
        emailVerified: ctx.session.user.emailVerified,
        createdAt: ctx.session.user.createdAt,
        updatedAt: ctx.session.user.updatedAt,
      },
      session: {
        id: ctx.session.session.id,
        expiresAt: ctx.session.session.expiresAt,
      },
    };
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Update user via Better-Auth
        const result = await auth.api.updateUser({
          body: {
            ...input,
          },
        });

        if (!result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update profile",
          });
        }

        return {
          success: true,
          message: "Profile updated successfully",
          user: result,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile. Please try again.",
        });
      }
    }),

  /**
   * Change password
   */
  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify current password and update
        const result = await auth.api.changePassword({
          body: {
            currentPassword: input.currentPassword,
            newPassword: input.newPassword,
          },
        });

        if (!result) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Current password is incorrect",
          });
        }

        return {
          success: true,
          message: "Password changed successfully",
        };
      } catch (error) {
        if (error instanceof Error && error.message.includes("incorrect")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Current password is incorrect",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change password. Please try again.",
        });
      }
    }),
});

export type AuthRouter = typeof authRouter;
