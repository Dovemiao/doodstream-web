import "./globals.css";

import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { SITENAME } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "正妹大尺度寫真團視頻站 - 高清亞洲美女寫真 & 視頻",
  description:
    "正妹大尺度寫真團視頻站，提供最新亞洲美女大尺度寫真、韓國正妹、Cosplay、秀人網高清套圖及免費視頻線上觀看。每日更新暗黑女神寫真，高速 doodstream 播放，免費下載打包！",
  keywords:
    "正妹寫真,大尺度寫真,亞洲美女,韓國正妹,Cosplay寫真,秀人網,暗黑女神,高清套圖,免費視頻,doodstream",
  metadataBase: new URL("https://asianbabyhome.indevs.in/"),
  alternates: {
    canonical: "https://asianbabyhome.indevs.in/",
  },
  openGraph: {
    title: "正妹大尺度寫真團視頻站",
    description:
      "最新亞洲大尺度寫真 & 高清視頻，每日更新韓國/中國/日本正妹，免費高速觀看！",
    url: "https://asianbabyhome.indevs.in/",
    siteName: "正妹大尺度寫真團視頻站",
    images: [
      {
        url: "/og-image.jpg", // 建議放 public/og-image.jpg (1200x630 尺寸最佳)
        width: 1200,
        height: 630,
        alt: "正妹大尺度寫真團視頻站 - 亞洲美女高清寫真",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "正妹大尺度寫真團視頻站",
    description: "亞洲美女大尺度寫真 & 視頻每日更新，免費觀看！",
    images: ["/twitter-image.jpg"], // 可與 og-image 共用同一張
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // viewport 等其他 meta 可視需要加，這裡 Next.js 預設會處理
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4TTQR094H5"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4TTQR094H5');
            `,
          }}
        />

        {/* 額外 SEO meta */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
      </head>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
