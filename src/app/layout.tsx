import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkLang AI — Professional Language Coach",
  description:
    "AI-powered professional language coach for German (C1) and English (B2).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
