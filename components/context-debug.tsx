import { Badge, Card, Code, Heading, Text } from "@whop/react/components";

type DebugRow = {
  label: string;
  value: string;
};

type ContextDebugProps = {
  title: string;
  description: string;
  allowed: boolean;
  rows: DebugRow[];
  message?: string;
};

export function ContextDebug({ title, description, allowed, rows, message }: ContextDebugProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-6 md:p-10">
      <div className="flex items-center gap-3">
        <Badge color={allowed ? "green" : "red"}>{allowed ? "Allowed" : "Denied"}</Badge>
        <Text color="gray" size="2">
          Whop runtime observation
        </Text>
      </div>

      <div className="space-y-2">
        <Heading as="h1" size="7">
          {title}
        </Heading>
        <Text color="gray">{description}</Text>
      </div>

      {message ? (
        <Card size="2">
          <Text color={allowed ? "gray" : "red"} size="2">
            {message}
          </Text>
        </Card>
      ) : null}

      <Card size="2">
        <Heading as="h2" size="4">
          Observed context
        </Heading>
        <dl className="mt-4 grid gap-4 sm:grid-cols-[11rem_1fr]">
          {rows.map((row) => (
            <div className="contents" key={row.label}>
              <dt className="text-sm text-gray-500 dark:text-gray-400">{row.label}</dt>
              <Code className="break-all">{row.value}</Code>
            </div>
          ))}
        </dl>
      </Card>

      <a className="w-fit text-sm underline underline-offset-4" href="/docs">
        Escalation concerns
      </a>
    </main>
  );
}
