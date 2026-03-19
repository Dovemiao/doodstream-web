// app/sitemap.ts
import type { MetadataRoute } from "next";

const API_KEY = process.env.DOODSTREAM_API_KEY;
const API_BASE = "https://doodapi.com/api";  // 官方 doodstream API 基底網址

if (!API_KEY) {
  console.warn("警告：DOODSTREAM_API_KEY 未設定，sitemap 只會包含首頁");
}

type DoodFile = {
  file_code: string;
  title?: string;
  uploaded?: string;  // 或其他可用的日期欄位
  // 根據實際 API 回應可能還有更多欄位
};

async function fetchAllFiles(): Promise<DoodFile[]> {
  if (!API_KEY) return [];

  let allFiles: DoodFile[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const url = `${API_BASE}/file/list?key=${API_KEY}&per_page=500&page=${page}`;
      const res = await fetch(url, {
        cache: "no-store",          // 避免使用舊快取
        next: { revalidate: 3600 }, // 可選：與 sitemap revalidate 同步
      });

      if (!res.ok) {
        console.error(`Doodstream file/list 請求失敗: ${res.status} - ${res.statusText}`);
        break;
      }

      const data = await res.json();

      if (data.status !== 200 || !Array.isArray(data.result?.files)) {
        console.error("Doodstream API 回應格式異常:", data.msg || data);
        hasMore = false;
        break;
      }

      const files = data.result.files as DoodFile[];
      allFiles = [...allFiles, ...files];

      // 如果這頁有資料但少於 per_page，代表到最後一頁
      hasMore = files.length === 500;
      page++;

      // 安全上限，避免無限循環或 API 濫用
      if (page > 20) {
        console.warn("已達 20 頁上限，停止拉取更多檔案");
        break;
      }
    }
  } catch (err) {
    console.error("fetchAllFiles 發生錯誤:", err);
  }

  return allFiles;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://asianbabyhome.indevs.in";
  const currentDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    // 你可以根據實際頁面再加其他靜態頁面，例如：
    // { url: `${baseUrl}/tags`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.7 },
  ];

  const files = await fetchAllFiles();

  const videoPages: MetadataRoute.Sitemap = files.map((file) => {
    // 請確認你的影片頁面路由格式
    // 如果是 /video/[file_code] → 改成 `${baseUrl}/video/${file.file_code}`
    // 如果是 /[file_code] → 保持下面這樣
    const videoUrl = `${baseUrl}/${file.file_code}`;

    let lastModified = currentDate;
    if (file.uploaded) {
      try {
        lastModified = new Date(file.uploaded);
      } catch {
        // 日期格式無效就用現在時間
      }
    }

    return {
      url: videoUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    };
  });

  return [...staticPages, ...videoPages];
}

// sitemap 重新驗證頻率（新影片加入後約 1 小時內更新）
export const revalidate = 3600; // 3600 秒 = 1 小時
