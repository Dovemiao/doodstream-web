// app/sitemap.ts
import type { MetadataRoute } from "next";

const API_KEY = process.env.DOODSTREAM_API_KEY;
const API_BASE = "https://doodapi.com/api";

if (!API_KEY) {
  console.warn("警告：DOODSTREAM_API_KEY 未設定，sitemap 只會包含首頁");
}

type DoodFile = {
  file_code: string;
  title?: string;
  uploaded?: string;
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
        cache: "no-store",
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        console.error(`Doodstream file/list 失敗: ${res.status} - ${res.statusText}`);
        break;
      }

      const data = await res.json();

      if (data.status !== 200 || !Array.isArray(data.result?.files)) {
        console.error("Doodstream API 回應異常:", data.msg || data);
        hasMore = false;
        break;
      }

      const files = data.result.files as DoodFile[];
      allFiles = [...allFiles, ...files];

      hasMore = files.length === 500;
      page++;

      if (page > 20) {
        console.warn("已達 20 頁上限，停止拉取更多檔案");
        break;
      }
    }
  } catch (err) {
    console.error("fetchAllFiles 錯誤:", err);
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
  ];

  const files = await fetchAllFiles();

  const videoPages: MetadataRoute.Sitemap = files.map((file) => {
    // 已修正：加上 /v/ 前綴，這是網站實際路由
    const videoUrl = `${baseUrl}/v/${file.file_code}`;

    let lastModified = currentDate;
    if (file.uploaded) {
      try {
        lastModified = new Date(file.uploaded);
      } catch {}
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

export const revalidate = 3600; // 1 小時重新生成
