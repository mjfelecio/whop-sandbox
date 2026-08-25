import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Whop Integration Sandbox",
  description: "A small app for validating Whop integration behavior.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <WhopApp
          accentColor="blue"
          appearance="inherit"
          sdkOptions={{ appId: appId ?? "app_unconfigured" }}
        >
          {children}
        </WhopApp>
      </body>
    </html>
  );
}
