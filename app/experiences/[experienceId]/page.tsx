import { ContextDebug } from "@/components/context-debug";
import { checkWhopAccess, getWhopExperience } from "@/lib/whop-access";
import { getAuthenticatedWhopUser } from "@/lib/whop-auth";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  const route = `/experiences/${experienceId}`;
  const auth = await getAuthenticatedWhopUser();
  const validExperienceId = experienceId.startsWith("exp_");

  const [access, experience] =
    auth.ok && validExperienceId
      ? await Promise.all([
          checkWhopAccess(auth.userId, experienceId),
          getWhopExperience(experienceId),
        ])
      : [null, null];

  const expectedAppId = process.env.NEXT_PUBLIC_WHOP_APP_ID;
  const appMatches = Boolean(
    experience?.ok && expectedAppId && experience.appId === expectedAppId,
  );
  const allowed = Boolean(
    auth.ok && access?.ok && access.hasAccess && experience?.ok && appMatches,
  );

  const message = !validExperienceId
    ? "The route parameter is not a Whop experience ID."
    : !auth.ok
      ? auth.message
      : access && !access.ok
        ? access.message
        : experience && !experience.ok
          ? experience.message
          : !appMatches
            ? "The experience is not powered by the configured Whop App ID."
            : allowed
              ? "The authenticated user has access to this Whop experience."
              : "Whop did not grant access to this experience."

  console.info("[whop-context]", {
    route,
    whopUserId: auth.ok ? auth.userId : null,
    whopCompanyId: experience?.ok ? experience.companyId : null,
    whopExperienceId: experienceId,
    experienceAppId: experience?.ok ? experience.appId : null,
    accessLevel: access?.ok ? access.accessLevel : null,
    allowed,
  });

  return (
    <ContextDebug
      allowed={allowed}
      description="Member-facing Experience View, scoped by a Whop experience."
      message={message}
      rows={[
        { label: "Current route", value: route },
        { label: "Whop user ID", value: auth.ok ? auth.userId : "Unavailable" },
        {
          label: "Whop company ID",
          value: experience?.ok ? experience.companyId : "Unavailable",
        },
        { label: "Whop experience ID", value: experienceId },
        {
          label: "Experience app ID",
          value: experience?.ok ? experience.appId : "Unavailable",
        },
        {
          label: "Attached products",
          value: experience?.ok
            ? experience.productIds.join(", ") || "None"
            : "Unavailable",
        },
        {
          label: "Token source",
          value: auth.ok ? auth.tokenSource : auth.reason,
        },
        {
          label: "Access result",
          value: access?.ok
            ? `${access.hasAccess} (${access.accessLevel})`
            : access?.reason ?? "Not checked",
        },
      ]}
      title="Experience context"
    />
  );
}
