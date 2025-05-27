import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Bike Yard",
  description: "Your One-Stop Shop for All Things Cycling",
  icons: {
    icon: "/img/bike-yard-logo.png",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#007bff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} ${roboto.className}`}>{children}</body>
    </html>
  );
}
