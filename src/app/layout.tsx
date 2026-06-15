import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProductOS — AI Operating System for Product Teams",
  description: "6-agent AI pipeline that converts customer interviews, tickets, and feedback into prioritized roadmaps, PRDs, and product strategy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
