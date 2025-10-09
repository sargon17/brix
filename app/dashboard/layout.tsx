import { cookies } from "next/headers";
import { AppSidebar } from "@/components/organisms/sidebar";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ConvexClientProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <main className="h-svh">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ConvexClientProvider>
  );
}
