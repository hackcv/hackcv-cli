import type { Command } from "commander";
import { fetchJson, asItems, parseSince } from "../api";
import { printItems, outputJson } from "../format";

export function registerHot(program: Command): void {
  program
    .command("hot")
    .description("当前热点条目")
    .option("--type <type>", "内容类型: paper | project | news")
    .option("--mode <mode>", "selected(默认) | all", "selected")
    .option("--since <since>", "时间窗口, 如 7d / 30d / 2026-01-01")
    .option("--category <category>", "分类筛选")
    .option("--tag <tag>", "标签筛选")
    .option("--limit <n>", "返回条数 (1-100)", "20")
    .option("--json", "输出原始 JSON")
    .option("--base <url>", "API 基址 (默认 https://ai.hackcv.com, 或设 HACKCV_BASE_URL)")
    .action(async (opts) => {
      const params: Record<string, string | number | undefined> = {
        type: opts.type,
        mode: opts.mode,
        category: opts.category,
        tag: opts.tag,
        take: opts.limit,
      };
      if (opts.since) params.since = parseSince(opts.since);
      const data = await fetchJson("/api/public/hot", params, { base: opts.base });
      const items = asItems(data);
      if (opts.json) return outputJson(items);
      printItems(items, "热点");
    });
}
