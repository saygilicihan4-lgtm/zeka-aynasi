import "./globals.css";

export const metadata = {
  title: "Zeka Aynası",
  description: "Zihnini keşfet, galaksini büyüt.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
