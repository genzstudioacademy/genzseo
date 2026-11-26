import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "GenZ SEO — Your Business. Everywhere Online.",
  description: "Manage your business presence, profile and SEO from one dashboard."
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
