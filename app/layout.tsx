import "./globals.css";
import { Sora } from "next/font/google";
import type { Metadata } from "next";


import { ConvexClientProvider } from "@/components/providers/convex-provider";

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
    <html lang="en">
      <body
        className={`${soraSans.variable} antialiased`}
      >
        <ConvexClientProvider>
          <main className="h-svh">
            {children}
          </main>
        </ConvexClientProvider>
      </body>
    </html >
  );
}
