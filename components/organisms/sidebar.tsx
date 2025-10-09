"use client";

import { Building2, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import ThemeTabs from "./theme-tabs";
import Link from "next/link";
import ProfileSwitcher from "./profile-switcher";
import { useProfileStore } from "@/store/profile-store";

const commonMenu = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
];

const buyerMenu = [
  ...commonMenu,
  {
    title: "Vendors",
    url: "/dashboard/vendors",
    icon: Building2,
  },
];

const adminMenu = [
  ...commonMenu,
  {
    title: "Vendor requests",
    url: "/dashboard/admin/vendor-requests",
    icon: Building2,
  },
];

export function AppSidebar() {
  const { profile } = useProfileStore((state) => state);

  const menu = profile === "admin" ? adminMenu : buyerMenu;

  return (
    <Sidebar>
      <SidebarHeader>
        <div>
          <h1 className="font-black text-2xl">
            brix <span className="italic font-normal text-blue-500">demo</span>
          </h1>
          <h2 className="text-secondary-foreground text-xs">
            by <a href="https://tymofyeyev.com/">tymofyeyev.com</a>
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>User type</SidebarGroupLabel>
          <SidebarGroupContent>
            <ProfileSwitcher />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeTabs />
      </SidebarFooter>
    </Sidebar>
  );
}
