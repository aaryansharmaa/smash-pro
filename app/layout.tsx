import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Smash Pro Arena Pickleball",
    template: "%s | Smash Pro Arena Pickleball",
  },
  description: "Premier rooftop pickleball court in Begumpet, Hyderabad.",
  keywords: [
    "pickleball",
    "hyderabad",
    "rooftop courts",
    "sports",
    "begumpet",
    "smash pro arena",
  ],
  authors: [{ name: "Smash Pro Pickleball Arena" }],
  openGraph: {
    title: "Smash Pro Arena Pickleball",
    description: "Premier rooftop pickleball court in Begumpet, Hyderabad",
    url: "https://www.smashpropickleball.in/",
    siteName: "Smash Pro Pickleball Arena",
    images: [
      {
        url: "/logo.png",
        width: 1800,
        height: 945,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <JsonLd />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
