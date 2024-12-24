import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Rubik } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const font = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X Persona Analyzer",
  description: "What's your Twitter personality? Get your AI-powered analysis",
  openGraph: {
    images: [
      "https://xtype.nmn.gl/og-image.png"
    ]
  },
  icons: {
    icon: "/favicon.png"
  },
  metadataBase: new URL('https://xtype.nmn.gl/')
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white h-full">
      <body className={`${font.className} bg-white min-h-full flex flex-col`}>
        <main className="flex-1 flex items-center justify-center bg-white">
          {children}
        </main>
        <Footer />
        <GoogleAnalytics gaId="G-6FF4W62MYL" />
      </body>
    </html>
  );
}
