import "./globals.css";
import type { Metadata } from "next";
import { Sora } from "next/font/google";

import { ConvexClientProvider } from "@/components/providers/convex-provider";
import ThemeProvider from "@/components/providers/theme-provider";

import { Toaster } from "@/components/ui/sonner";

const soraSans = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tymofyeyev x Brix",
  description: "Brix.supply take-home by Mykhaylo Tymofyeyev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${soraSans.variable} antialiased`}>
        <ThemeProvider>
          <ConvexClientProvider>
            <main className="h-svh">
              {children}
              <Toaster />
            </main>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
