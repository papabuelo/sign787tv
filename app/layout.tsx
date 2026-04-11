import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIGN787 — Digital Signage CRM",
  description: "Remote management platform for Digital Signage Screens. Control content, layouts, and devices across all your client locations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        {children}
      </body>
    </html>
  );
}
