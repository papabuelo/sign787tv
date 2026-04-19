import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./ui-components.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIGN787 — Digital Signage CRM",
  description: "Remote management platform for Digital Signage Screens. Control content, layouts, and devices across all your client locations.",
  keywords: "digital signage, CRM, content management, remote control, displays, screens",
  authors: [{ name: "SIGN787 Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#0f172a",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: "SIGN787 — Digital Signage CRM",
    description: "Professional digital signage management platform",
    url: "https://sign787tv.vercel.app",
    siteName: "SIGN787",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SIGN787 Digital Signage Platform",
      },
    ],
    locale: "es_PR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIGN787 — Digital Signage CRM",
    description: "Remote management platform for Digital Signage Screens",
    images: ["/twitter-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SIGN787" />
        <link rel="apple-touch-startup-image" href="/splash-screen.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Background effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float animation-delay-2000" />
        </div>
        
        {/* Main content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
        
        {/* Loading indicator */}
        <div id="loading-indicator" className="fixed top-4 right-4 z-50 hidden">
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-white text-sm">Cargando...</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}