import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const vietnamese = localFont({
  src: "../../node_modules/@fontsource/noto-sans/files/noto-sans-vietnamese-400-normal.woff2",
  variable: "--font-vietnamese",
  display: "swap",
});
const latin = localFont({
  src: "../../node_modules/@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2",
  variable: "--font-latin",
  display: "swap",
});
const chinese = localFont({
  src: "../../node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff2",
  variable: "--font-chinese",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zhonglish",
  description: "English and Chinese learning for beginners.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${vietnamese.variable} ${latin.variable} ${chinese.variable}`}>
      <body>{children}</body>
    </html>
  );
}
