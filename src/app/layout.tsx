import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "EduFind — Find Your College in India",
    template: "%s | EduFind",
  },
  description:
    "Discover, compare, and shortlist colleges across India. Search by fees, location, and placements — built for students making informed decisions.",
  keywords: ["college discovery", "compare colleges", "India", "engineering colleges", "admissions"],
  authors: [{ name: "EduFind" }],
  openGraph: {
    title: "EduFind — College Discovery Platform",
    description: "Search, compare, and save colleges across India.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
