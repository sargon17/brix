import type { PropsWithChildren } from "react";
import DashboardActions from "./actions";
import DashboardContent from "./content";
import DashboardHeader from "./header";
import DashboardSubtitle from "./subtitle";
import DashboardTitle from "./title";

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
