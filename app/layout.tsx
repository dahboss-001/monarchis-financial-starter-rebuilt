import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monarchis Financial | Clarity for your financial future",
  description:
    "Monarchis Financial is a premium client-services platform for digital asset investing: secure onboarding, portfolio insight and honest, target-based plans. Currently in demonstration mode.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
