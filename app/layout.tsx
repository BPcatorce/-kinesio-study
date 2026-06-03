import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KineStudy — Kinesiología Intensivista",
  description: "App de estudio personalizada para kinesiólogos intensivistas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
