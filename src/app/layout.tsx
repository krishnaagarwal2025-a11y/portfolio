import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KrishnaOS — Krishna Agarwal | Developer Workstation",
  description:
    "An interactive retro operating system portfolio for Krishna Agarwal — Computer Science student at VIT Vellore exploring Cybersecurity, Software Development, Networking, AI/RAG, and Embedded Systems.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect x='3' y='3' width='26' height='20' rx='1' fill='%23c0c0c0'/><rect x='6' y='6' width='20' height='14' fill='%23008080'/></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#008080",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
