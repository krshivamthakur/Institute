import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura IMS - Comprehensive Institute Management System",
  description: "Enterprise multi-role, multi-branch Institute Management System (IMS) with AI features, LMS, Finance, HR, and Portals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">{children}</body>
    </html>
  );
}
