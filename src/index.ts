#!/usr/bin/env node
import { Command } from "commander";
import { registerHot } from "./commands/hot";
import { registerRecommend } from "./commands/recommend";

const program = new Command();

program
  .name("hackcv-cli")
  .description("命令行访问 hackcv AI 研究简报")
  .version("0.1.0");

registerHot(program);
registerRecommend(program);

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(msg + "\n");
  process.exit(1);
});
