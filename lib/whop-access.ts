import "server-only";

import { getWhopClient, WhopConfigurationError } from "@/lib/whop-sdk";

export type WhopAccessResult =
  | {
      ok: true;
      hasAccess: boolean;
      accessLevel: "admin" | "customer" | "no_access";
    }
  | {
      ok: false;
      reason: "configuration" | "api_error";
      message: string;
    };

export async function checkWhopAccess(
  whopUserId: string,
  resourceId: string,
): Promise<WhopAccessResult> {
  try {
    const access = await getWhopClient().users.checkAccess(resourceId, {
      id: whopUserId,
    });

    return {
      ok: true,
      hasAccess: access.has_access,
      accessLevel: access.access_level,
    };
  } catch (error) {
    const configurationError = error instanceof WhopConfigurationError;

    console.error("[whop-access-error]", {
      resourceId,
      whopUserId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });

    return {
      ok: false,
      reason: configurationError ? "configuration" : "api_error",
      message: configurationError
        ? "WHOP_API_KEY is not configured."
        : "Whop access check failed. Inspect the server log and API permissions.",
    };
  }
}

export type WhopExperienceResult =
  | {
      ok: true;
      id: string;
      name: string;
      appId: string;
      companyId: string;
      productIds: string[];
    }
  | {
      ok: false;
      reason: "configuration" | "api_error";
      message: string;
    };

export async function getWhopExperience(whopExperienceId: string): Promise<WhopExperienceResult> {
  try {
    const experience = await getWhopClient().experiences.retrieve(whopExperienceId);

    return {
      ok: true,
      id: experience.id,
      name: experience.name,
      appId: experience.app.id,
      companyId: experience.company.id,
      productIds: experience.products.map((product) => product.id),
    };
  } catch (error) {
    const configurationError = error instanceof WhopConfigurationError;

    console.error("[whop-experience-error]", {
      whopExperienceId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });

    return {
      ok: false,
      reason: configurationError ? "configuration" : "api_error",
      message: configurationError
        ? "WHOP_API_KEY is not configured."
        : "Whop experience lookup failed. Inspect the server log and API permissions.",
    };
  }
}
