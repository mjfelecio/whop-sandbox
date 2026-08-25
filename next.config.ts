import type { NextConfig } from "next";
import { withWhopAppConfig } from "@whop/react/next.config";

const nextConfig: NextConfig = {
  agentRules: false,
};

export default withWhopAppConfig(nextConfig);
