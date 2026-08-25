import { ContextDebug } from "@/components/context-debug";
import { checkWhopAccess } from "@/lib/whop-access";
import { getAuthenticatedWhopUser } from "@/lib/whop-auth";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const route = `/dashboard/${companyId}`;
  const auth = await getAuthenticatedWhopUser();
  const validCompanyId = companyId.startsWith("biz_");
  const access = auth.ok && validCompanyId ? await checkWhopAccess(auth.userId, companyId) : null;
  const allowed = Boolean(auth.ok && access?.ok && access.accessLevel === "admin");

  const message = !validCompanyId
    ? "The route parameter is not a Whop company ID."
    : !auth.ok
      ? auth.message
      : access && !access.ok
        ? access.message
        : allowed
          ? "The authenticated user is a team member of this Whop company."
          : "Whop did not return admin access for this company.";

  console.info("[whop-context]", {
    route,
    whopUserId: auth.ok ? auth.userId : null,
    whopCompanyId: companyId,
    whopExperienceId: null,
    accessLevel: access?.ok ? access.accessLevel : null,
    allowed,
  });

  return (
    <ContextDebug
      allowed={allowed}
      description="Business-facing Dashboard View, scoped by Whop company."
      message={message}
      rows={[
        { label: "Current route", value: route },
        { label: "Whop user ID", value: auth.ok ? auth.userId : "Unavailable" },
        { label: "Whop company ID", value: companyId },
        { label: "Whop experience ID", value: "Not supplied to Dashboard View" },
        {
          label: "Token source",
          value: auth.ok ? auth.tokenSource : auth.reason,
        },
        {
          label: "Access result",
          value: access?.ok
            ? `${access.hasAccess} (${access.accessLevel})`
            : (access?.reason ?? "Not checked"),
        },
      ]}
      title="Dashboard context"
    />
  );
}
