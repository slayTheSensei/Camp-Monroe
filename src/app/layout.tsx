import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import SmoothAnchor from "@/components/SmoothAnchor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Cambridge Gun & Rod Club — Camp Monroe, Maine",
  description:
    "The Cambridge Gun & Rod Club, est. 1893 — a private membership club and historic lakefront property on Lake Cobbosseecontee, Maine. Rooted in a 130-year legacy of Black outdoor life.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Cambridge Gun & Rod Club — Camp Monroe",
    description: "130 years of Black outdoor life. One of a kind in America.",
    siteName: "Camp Monroe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased" data-take="editorial">
        <SmoothAnchor />
        {children}
      </body>
    </html>
  );
}
