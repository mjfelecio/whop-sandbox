import "server-only";

import { getWhopClient, WhopConfigurationError } from "@/lib/whop-sdk";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { headers } from "next/headers";

export type WhopAuthenticationResult =
  | {
      ok: true;
      userId: string;
      tokenAppId: string;
      tokenSource: "header" | "development_claims";
    }
  | {
      ok: false;
      reason: "configuration" | "missing_token" | "invalid_token";
      message: string;
    };

function getLocalDevelopmentTokenClaims(
  token: string,
  expectedAppId: string,
  requestHeaders: Headers,
): { userId: string; appId: string } | null {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const host = requestHeaders.get("host")?.toLowerCase();
  const localHost = Boolean(
    host &&
      (host === "localhost" ||
        host.startsWith("localhost:") ||
        host === "127.0.0.1" ||
        host.startsWith("127.0.0.1:") ||
        host === "[::1]" ||
        host.startsWith("[::1]:")),
  );

  if (!localHost) {
    return null;
  }

  try {
    const protectedHeader = decodeProtectedHeader(token);
    const payload = decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);

    const validLifetime = Boolean(
      typeof payload.iat === "number" &&
        typeof payload.exp === "number" &&
        payload.iat <= now + 60 &&
        payload.exp > now &&
        payload.exp - payload.iat <= 24 * 60 * 60,
    );
    const validNotBefore =
      typeof payload.nbf !== "number" || payload.nbf <= now + 60;

    if (
      protectedHeader.alg !== "ES256" ||
      typeof protectedHeader.kid !== "string" ||
      !protectedHeader.kid ||
      payload.isDev !== true ||
      payload.iss !== "urn:whopcom:exp-proxy" ||
      payload.aud !== expectedAppId ||
      typeof payload.sub !== "string" ||
      !payload.sub.startsWith("user_") ||
      !validLifetime ||
      !validNotBefore
    ) {
      return null;
    }

    return { userId: payload.sub, appId: payload.aud };
  } catch {
    return null;
  }
}

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
    // Whop's localhost launcher currently issues `isDev` tokens whose signing
    // key is not published by either documented Whop JWKS endpoint. Keep this
    // fallback local and development-only; production always requires the SDK's
    // cryptographic verification above.
    const developmentClaims = getLocalDevelopmentTokenClaims(
      headerToken,
      expectedAppId,
      currentHeaders,
    );

    if (developmentClaims) {
      console.warn(
        "[whop-auth] Using localhost-only development token claims because Whop's JWKS did not contain the development signing key.",
      );

      return {
        ok: true,
        userId: developmentClaims.userId,
        tokenAppId: developmentClaims.appId,
        tokenSource: "development_claims",
      };
    }

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
