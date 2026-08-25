import { withWhopAppConfig } from "@whop/react/next.config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    // Next 16.3's CLI path can truncate `tsc --showConfig` output during builds.
    // The compiler API performs the same checks without the flaky subprocess.
    useTypeScriptCli: false,
  },
};

export default withWhopAppConfig(nextConfig);
