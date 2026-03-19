// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://asianbabyhome.indevs.in";

  return {
    rules: [
      {
        userAgent: "*",  // 適用所有爬蟲
        allow: "/",      // 允許爬取全部
        // 如果有不想被爬的頁面，加 disallow，例如：
        // disallow: ["/admin", "/private", "/api/*"],
      },
      // 可針對特定爬蟲加規則，例如 Google：
      // {
      //   userAgent: "Googlebot",
      //   allow: "/",
      //   disallow: "/tmp/",
      // },
    ],
    // 重要：指向你的 sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
    // 可選：加 host
    host: baseUrl,
  };
}

// 可選：讓 robots.txt 經常更新
export const revalidate = 86400; // 每天重新生成一次
