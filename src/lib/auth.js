import { jwt } from "better-auth/plugins";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  
user: {
  modelName: "users",
  additionalFields: {
    role: { type: "string", required: true, defaultValue: "customer", input: true },
    phone: { type: "string", required: false },
    area: { type: "string", required: false },
    bio: { type: "string", required: false },
  },
},
plugins: [jwt(), nextCookies()], // nextCookies stays last


});