import type { Command } from "commander";
import { fetchJson, asItems } from "../api";
import { printItems, outputJson } from "../format";

export function registerRecommend(program: Command): void {
  program
    .command("recommend")
    .description("LLM 精选推荐 (取 mode=selected 的 recommendation, 按 score 排序)")
    .option("--type <type>", "内容类型: paper | project | news")
    .option("--category <category>", "分类筛选")
    .option("--tag <tag>", "标签筛选")
    .option("--limit <n>", "返回条数 (1-100)", "20")
    .option("--json", "输出原始 JSON")
    .option("--base <url>", "API 基址 (默认 https://ai.hackcv.com, 或设 HACKCV_BASE_URL)")
    .action(async (opts) => {
      const params: Record<string, string | number | undefined> = {
        mode: "selected",
        type: opts.type,
        category: opts.category,
        tag: opts.tag,
        take: opts.limit,
      };
      const data = await fetchJson("/api/public/items", params, { base: opts.base });
      const limit = Number(opts.limit) || 20;
      const items = asItems(data)
        .filter((i: any) => i && (i.recommendation || i.selected))
        .sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, limit);
      if (opts.json) return outputJson(items);
      printItems(items, "精选推荐", true);
    });
}
