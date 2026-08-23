import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tim's Cake — Handcrafted Cakes Made With Love",
  description:
    "Premium handcrafted cakes for every occasion. From classic chocolate to signature creations, Tim's Cake delivers bakery perfection to your door.",
  keywords: [
    "bakery",
    "cakes",
    "handcrafted cakes",
    "custom cakes",
    "Tim's Cake",
    "premium bakery",
    "cake delivery",
  ],
  authors: [{ name: "Tim's Cake" }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/logo.png', sizes: '1080x1080', type: 'image/png' },
    ],
  },
  verification: {
    google: 'rsf9fephcOG6-4OmXLVxtu-RPDQ_ZdLT_wZza7DdI0g',
  },
  openGraph: {
    title: "Tim's Cake — Handcrafted Cakes Made With Love",
    description:
      "Premium handcrafted cakes for every occasion. From classic chocolate to signature creations.",
    siteName: "Tim's Cake",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "oklch(0.995 0.005 80)",
              border: "1px solid oklch(0.90 0.02 60)",
              color: "oklch(0.22 0.04 40)",
            },
          }}
        />
      </body>
    </html>
  );
}
