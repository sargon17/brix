import type { PropsWithChildren } from "react";

interface DashboardSubtitleProps extends PropsWithChildren {}
export default function DashboardSubtitle({
  children,
}: DashboardSubtitleProps) {
  return <p className="max-w-2xl text-sm text-muted-foreground">{children}</p>;
}
