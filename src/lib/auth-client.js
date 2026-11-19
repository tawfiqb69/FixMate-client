import { createAuthClient } from "better-auth/react";
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        phone: { type: "string" },
        area: { type: "string" },
        bio: { type: "string" },
      },
    }),
  ],
});