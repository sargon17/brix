import type { PropsWithChildren, ReactNode } from "react";

interface DashboardHeaderProps extends PropsWithChildren {
  actionChildren?: ReactNode | undefined;
}
export default function DashboardHeader({
  children,
  actionChildren,
}: DashboardHeaderProps) {
  return (
    <div className="flex">
      <div className="space-y-2">{children}</div>
      {actionChildren && <div className="ml-auto">{actionChildren}</div>}
    </div>
  );
}
