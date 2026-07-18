function dim(s: string): string {
  return `\x1b[2m${s}\x1b[0m`;
}
function bold(s: string): string {
  return `\x1b[1m${s}\x1b[0m`;
}
function cyan(s: string): string {
  return `\x1b[36m${s}\x1b[0m`;
}

export function outputJson(data: unknown): void {
  process.stdout.write(JSON.stringify(data, null, 2) + "\n");
}

export function printItems(items: any[], title: string, showRec = false): void {
  if (!items.length) {
    process.stdout.write(dim("（无结果）\n"));
    return;
  }
  process.stdout.write(bold(`hackcv · ${title}`) + dim(`  (${items.length} 条)\n`));
  for (const it of items) {
    const t = it.title_zh || it.title || "(无标题)";
    const src = [it.source, ...(it.sources || [])].filter(Boolean)[0] || "";
    const meta = [it.type, it.category, src, it.publishedAt?.slice(0, 10)]
      .filter(Boolean)
      .join(" · ");
    process.stdout.write(`\n${bold(t)}\n`);
    if (meta) process.stdout.write(dim(meta + "\n"));
    if (showRec && it.recommendation) {
      process.stdout.write(cyan(String(it.recommendation).slice(0, 220)) + "\n");
    }
    if (it.permalink) process.stdout.write(dim(it.permalink) + "\n");
  }
}
