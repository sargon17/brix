import type { PropsWithChildren } from "react";

interface DashboardActionsProps extends PropsWithChildren {

}
export default function DashboardActions({ children }: DashboardActionsProps) {
  return (
    <div>
      {children}
    </div>
  )
}
