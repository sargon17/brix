"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : undefined;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convexClient) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Convex URL missing. ConvexProvider is not mounted.");
    }
    return <>{children}</>;
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
