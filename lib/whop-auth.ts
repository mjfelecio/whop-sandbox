import "server-only";

import { getWhopClient, WhopConfigurationError } from "@/lib/whop-sdk";
import { headers } from "next/headers";

export type WhopAuthenticationResult =
  | {
      ok: true;
      userId: string;
      tokenAppId: string;
      tokenSource: "header";
    }
  | {
      ok: false;
      reason: "configuration" | "missing_token" | "invalid_token";
      message: string;
    };

export async function getAuthenticatedWhopUser(
  requestHeaders?: Headers,
): Promise<WhopAuthenticationResult> {
  const expectedAppId = process.env.NEXT_PUBLIC_WHOP_APP_ID;

  if (!expectedAppId) {
    return {
      ok: false,
      reason: "configuration",
      message: "NEXT_PUBLIC_WHOP_APP_ID is not configured.",
    };
  }

  const currentHeaders = requestHeaders ?? (await headers());
  const headerToken = currentHeaders.get("x-whop-user-token");

  if (!headerToken) {
    return {
      ok: false,
      reason: "missing_token",
      message: "No Whop iframe user token was attached to this request.",
    };
  }

  let verified;

  try {
    verified = await getWhopClient().verifyUserToken(currentHeaders, {
      dontThrow: true,
      publicKey: process.env.WHOP_JWK_PK,
    });
  } catch (error) {
    if (error instanceof WhopConfigurationError) {
      return {
        ok: false,
        reason: "configuration",
        message: error.message,
      };
    }

    throw error;
  }

  if (!verified) {
    return {
      ok: false,
      reason: "invalid_token",
      message: "The Whop iframe user token is invalid, expired, or for another app.",
    };
  }

  return {
    ok: true,
    userId: verified.userId,
    tokenAppId: verified.appId,
    tokenSource: "header",
  };
}
