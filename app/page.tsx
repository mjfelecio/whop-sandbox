import { Badge, Card, Heading, Text } from "@whop/react/components";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-6 md:p-10">
      <div className="flex items-center gap-3">
        <Badge color="blue">Phase 1</Badge>
        <Text color="gray" size="2">Identity and view diagnostics</Text>
      </div>

      <div className="space-y-2">
        <Heading as="h1" size="8">Whop integration sandbox</Heading>
        <Text color="gray">
          Open the configured Dashboard or Experience View from Whop to observe the
          authenticated user and access decision.
        </Text>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card size="2">
          <Heading as="h2" size="4">Dashboard View</Heading>
          <Text color="gray" size="2">
            Configure <code>/dashboard/[companyId]</code> in Whop. This view receives a
            company ID and requires Whop admin access.
          </Text>
        </Card>

        <Card size="2">
          <Heading as="h2" size="4">Experience View</Heading>
          <Text color="gray" size="2">
            Configure <code>/experiences/[experienceId]</code> in Whop. This view receives
            an experience ID and checks member access.
          </Text>
        </Card>
      </div>

      <Link className="w-fit text-sm underline underline-offset-4" href="/docs">
        Escalation concerns
      </Link>
    </main>
  );
}
