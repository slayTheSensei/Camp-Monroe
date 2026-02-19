import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Camp Monroe — Outdoor Adventures in Maine",
  description:
    "Guided camping trips, retreats, and outdoor experiences in Maine built for Black and brown explorers. Rooted in the legacy of the Cambridge Gun & Rod Club, est. 1893.",
  openGraph: {
    title: "Camp Monroe",
    description: "The outdoors has always been ours. We're just reclaiming it.",
    siteName: "Camp Monroe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
