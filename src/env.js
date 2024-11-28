import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    WALLET_KIT_API_URL: z.string(),
    WALLET_KIT_DEVELOPER_SECRET: z.string(),
    WALLET_KIT_API_TOKEN: z.string(),
    WALLET_KIT_PROJECT_ID: z.string(),
    AGENT_OWNER_ID: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    WALLET_KIT_API_URL: process.env.WALLET_KIT_API_URL,
    WALLET_KIT_DEVELOPER_SECRET: process.env.WALLET_KIT_DEVELOPER_SECRET,
    WALLET_KIT_API_TOKEN: process.env.WALLET_KIT_API_TOKEN,
    WALLET_KIT_PROJECT_ID: process.env.WALLET_KIT_PROJECT_ID,
    AGENT_OWNER_ID: process.env.AGENT_OWNER_ID,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
