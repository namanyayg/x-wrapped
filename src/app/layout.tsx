import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Rubik } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const font = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X Wrapped",
  description: "Review your year on X",
  openGraph: {
    images: [
      "https://x.nmn.gl/og-image.png"
    ]
  },
  icons: {
    icon: "/favicon.png"
  },
  metadataBase: new URL('https://x.nmn.gl/')
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white h-full">
      <body className={`${font.className} min-h-full flex flex-col`}>
        <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          {children}
        </main>
        <Footer />
        <GoogleAnalytics gaId="G-6FF4W62MYL" />
      </body>
    </html>
  );
}
