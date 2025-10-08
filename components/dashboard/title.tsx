import type { PropsWithChildren } from "react";
import { SidebarTrigger } from "../ui/sidebar";

interface DashboardTitleProps extends PropsWithChildren {

}
export default function DashboardTitle({ children }: DashboardTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger />
      <h1 className="text-3xl font-semibold  text-foreground">
        {children}
      </h1>
    </div>
  )
}
