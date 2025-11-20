import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Next.js + Supabase Mini Auth",
  description:
    "ตัวอย่างโปรเจค Next.js 15 + Supabase + shadcn/ui สำหรับ Mini Auth System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.variable} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
