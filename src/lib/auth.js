import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { client, db } from "./db";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),

  user: {
    modelName: "users",
    additionalFields: {
      
      // Better Auth does NOT check these values at runtime, so the hook below does.
      // input: true is needed because the Sign Up page lets the user pick customer or technician.
      role: {
        type: ["customer", "technician", "admin"],
        input: true,
        required: false,
        defaultValue: "customer",
      },
      phone: { type: "string", required: false },
      area: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Only "technician" is allowed. Everything else becomes "customer".
          const safeRole = user.role === "technician" ? "technician" : "customer";
          return { data: { ...user, role: safeRole } };
        },
      },
      update: {
        before: async (data) => {
          // Nobody can change role through Better Auth.
          // Admin role changes go through the Express admin API.
          const { role, ...rest } = data;
          return { data: rest };
        },
      },
    },
  },

  emailAndPassword: { enabled: true },

  plugins: [jwt()],

  session: { cookieCache: { enabled: false } },
});