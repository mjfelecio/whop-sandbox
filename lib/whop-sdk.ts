import "server-only";

import { Whop } from "@whop/sdk";

export class WhopConfigurationError extends Error {
  constructor(variable: string) {
    super(`Missing required environment variable: ${variable}`);
    this.name = "WhopConfigurationError";
  }
}

export function getWhopClient(): Whop {
  const apiKey = process.env.WHOP_API_KEY;
  const appID = process.env.NEXT_PUBLIC_WHOP_APP_ID;

  if (!apiKey) {
    throw new WhopConfigurationError("WHOP_API_KEY");
  }

  if (!appID) {
    throw new WhopConfigurationError("NEXT_PUBLIC_WHOP_APP_ID");
  }

  return new Whop({
    apiKey,
    appID,
    baseURL: process.env.WHOP_API_BASE_URL,
  });
}
