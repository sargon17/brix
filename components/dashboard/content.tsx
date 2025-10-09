import type { PropsWithChildren } from "react";

interface DashboardContentProps extends PropsWithChildren {}
export default function DashboardContent({ children }: DashboardContentProps) {
  return <div className="flex-1">{children}</div>;
}
