import type { Metadata, Viewport } from "next";
import { Geist_Mono, Merriweather, Space_Grotesk } from "next/font/google";
import { profile, SITE_URL } from "@/lib/content";
import { cn } from "@/lib/utils";
import "./globals.css";

// Headings: Merriweather. Body: Space Grotesk. Small labels: Geist Mono.
const merriweatherHeading = Merriweather({ subsets: ["latin"], variable: "--font-heading" });

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description = `${profile.role} and ${profile.headline}. ${profile.pitch}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${profile.name} · ${profile.role}`,
  description,
  authors: [{ name: profile.name, url: SITE_URL }],
  keywords: ["Heet Dobariya", "AI Engineer", "LLM", "RAG", "FastAPI", "Portfolio", "Serin Labs"],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${profile.name} · ${profile.role}`,
    description,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.role}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("dark antialiased font-sans", spaceGrotesk.variable, merriweatherHeading.variable, geistMono.variable)}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
