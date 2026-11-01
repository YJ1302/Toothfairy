import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Tooth Fairy Pediatric Dentistry | Children's Dentist in Pune",
  description:
    "Gentle dental care for children in Pune with Dr. Anusha Killedar. Book a visit online, and follow your child's medicines day by day in the parent app.",
};

export const viewport: Viewport = {
  themeColor: "#8b6ccf",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
