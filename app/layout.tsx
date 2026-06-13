import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Villa Nelith | Luxury Architectural A-Frame Resort",
  description: "Experience architectural mastery at Villa Nelith. A luxury A-frame resort blending natural warm wood and dark modern steel, nestled in a lush tropical garden paradise.",
  keywords: ["Villa Nelith", "Luxury Resort", "Architectural Villa", "A-Frame Luxury Villa", "Bespoke Vacation Rental", "Exclusive Getaway"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#fbfbfd] text-[#1d1d1f] selection:bg-[#2d5a3e]/20 selection:text-[#1d1d1f]">
        {children}
      </body>
    </html>
  );
}
