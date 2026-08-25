import { Badge, Card, Heading, Text } from "@whop/react/components";
import Link from "next/link";

const concerns = [
  {
    title: "Whop package maturity",
    detail:
      "Whop's official Next.js template pins @whop/sdk 0.0.3, while npm labels an incompatible generated-client line as latest (1.x). Keep the documented app SDK pinned and confirm Whop's versioning direction before production.",
  },
  {
    title: "Environment and credentials",
    detail:
      "Choose production Whop or sandbox Whop, then provide an App ID and matching App API key. Keys and IDs from different environments cannot be mixed.",
  },
  {
    title: "Dashboard permissions",
    detail:
      "Whop's admin access level includes company team roles such as moderators. Decide later which actions require stricter application-owned RBAC.",
  },
] as const;

export default function DocsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-6 md:p-10">
      <div className="flex items-center gap-3">
        <Badge color="amber">Escalation</Badge>
        <Text color="gray" size="2">Only unresolved concerns</Text>
      </div>

      <div className="space-y-2">
        <Heading as="h1" size="7">Concerns requiring a decision</Heading>
        <Text color="gray">Keep this list short. Remove items once resolved.</Text>
      </div>

      <div className="space-y-3">
        {concerns.map((concern) => (
          <Card key={concern.title} size="2">
            <Heading as="h2" size="4">{concern.title}</Heading>
            <Text color="gray" size="2">{concern.detail}</Text>
          </Card>
        ))}
      </div>

      <Link className="w-fit text-sm underline underline-offset-4" href="/">
        Back to overview
      </Link>
    </main>
  );
}
