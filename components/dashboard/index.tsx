import type { PropsWithChildren } from "react";
import DashboardHeader from "./header";
import DashboardTitle from "./title";
import DashboardActions from "./actions";
import DashboardSubtitle from "./subtitle";
import DashboardContent from "./content";

interface DashboardProps extends PropsWithChildren {}
function Dashboard({ children }: DashboardProps) {
  return (
    <section className="flex flex-col gap-8 p-6 pb-16 h-full">
      {children}
    </section>
  );
}

export {
  Dashboard,
  DashboardHeader,
  DashboardTitle,
  DashboardSubtitle,
  DashboardActions,
  DashboardContent,
};
