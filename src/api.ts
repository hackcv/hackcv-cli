const DEFAULT_BASE = "https://ai.hackcv.com";

export interface ApiOptions {
  base?: string;
  signal?: AbortSignal;
}

export class HackcvApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public url: string,
  ) {
    super(message);
    this.name = "HackcvApiError";
  }
}

export async function fetchJson<T = unknown>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  opts: ApiOptions = {},
): Promise<T> {
  const base = (opts.base || process.env.HACKCV_BASE_URL || DEFAULT_BASE).replace(/\/+$/, "");
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  const url = `${base}${path}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, {
    signal: opts.signal,
    headers: { "user-agent": "hackcv-cli/0.1.0" },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new HackcvApiError(
      res.status,
      `${res.status} ${res.statusText}${body ? `: ${body.slice(0, 200)}` : ""}`,
      url,
    );
  }
  return (await res.json()) as T;
}

// /hot 直接返回数组；/items 返回 { items: [] } 包装；统一兼容
export function asItems(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.items)) return o.items as any[];
    if (Array.isArray(o.data)) return o.data as any[];
  }
  return [];
}

// 把 "7d" / "30d" 转成 ISO date-time（API since 限最近 30 天）
export function parseSince(input: string): string {
  const m = /^(\d+)\s*d$/i.exec(input.trim());
  if (m) {
    const days = Math.min(Number(m[1]), 30);
    return new Date(Date.now() - days * 864e5).toISOString();
  }
  // 否则原样返回（支持 YYYY-MM-DD 或完整 ISO）
  return input;
}
