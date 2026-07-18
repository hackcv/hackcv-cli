# hackcv-cli

命令行访问 [hackcv](https://ai.hackcv.com) 的 AI 研究简报：实时热点（`hot`）与 LLM 精选推荐（`recommend`）。无需鉴权，返回 JSON 或人类可读格式。

## 安装

```bash
# 全局安装
npm install -g hackcv-cli

# 或不安装，直接用 npx
npx hackcv-cli@latest hot --limit 3

# 国内镜像
npm install -g hackcv-cli --registry https://registry.npmmirror.com
```

要求 **Node ≥ 18**（使用内置 `fetch`）。

## 命令

### `hot` — 当前热点

```bash
hackcv-cli hot [options]
```

| 选项 | 说明 |
|---|---|
| `--type <type>` | 内容类型：`paper` \| `project` \| `news` |
| `--mode <mode>` | `selected`（默认，LLM 精选）\| `all` |
| `--since <since>` | 时间窗口：`7d` / `30d` / `2026-01-01` |
| `--category <cat>` | 分类筛选 |
| `--tag <tag>` | 标签筛选 |
| `--limit <n>` | 返回条数（1-100，默认 20） |
| `--json` | 输出原始 JSON |
| `--base <url>` | API 基址（默认 `https://ai.hackcv.com`，或设环境变量 `HACKCV_BASE_URL`） |

示例：

```bash
hackcv-cli hot --type project --limit 5
hackcv-cli hot --since 7d --tag llm --json
```

### `recommend` — LLM 精选推荐

取 `mode=selected` 中带 `recommendation` 的条目，按 `score` 降序。

```bash
hackcv-cli recommend [options]
```

| 选项 | 说明 |
|---|---|
| `--type <type>` | 内容类型：`paper` \| `project` \| `news` |
| `--category <cat>` | 分类筛选 |
| `--tag <tag>` | 标签筛选 |
| `--limit <n>` | 返回条数（1-100，默认 20） |
| `--json` | 输出原始 JSON |
| `--base <url>` | API 基址 |

示例：

```bash
hackcv-cli recommend --limit 3
hackcv-cli recommend --type paper --json
```

## 环境变量

| 变量 | 说明 |
|---|---|
| `HACKCV_BASE_URL` | 自定义 API 基址（等价于 `--base`） |

## 数据来源

所有数据来自 hackcv 公开 REST API（[OpenAPI 规范](https://ai.hackcv.com/openapi.yaml)）：

- `hot` → `GET /api/public/hot`
- `recommend` → `GET /api/public/items?mode=selected`

更多接入方式见 [开发者中心](https://ai.hackcv.com/developers)。

## License

MIT
