import "./globals.css";
import { Sora } from "next/font/google";
import type { Metadata } from "next";


import { ConvexClientProvider } from "@/components/providers/convex-provider";
import ThemeProvider from "@/components/providers/theme-provider";

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
      <body
        className={`${soraSans.variable} antialiased`}
      >
        <ThemeProvider>
          <ConvexClientProvider>
            <main className="h-svh">
              {children}
            </main>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
