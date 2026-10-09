# 站点地图与 IndexNow 本地维护说明

当前 IndexNow 使用简单提交脚本，操作方法见 [中文配置说明](indexnow-setup.md)。旧的自动流程、Vercel API 校验和 GitHub 提交记录脚本已从本地移除，不再需要额外服务配置。

## 需要保留的内容

- `.env.local` 中的 `INDEXNOW_KEY`：简单提交命令需要它，文件保持 Git 忽略。
- Vercel 生产环境中的同一密钥：构建时生成根目录密钥验证文件，不能删除。
- `scripts/seo/manual-indexnow.mjs`、`submit-indexnow.mjs`、`verify-key.mjs` 及对应测试：负责提交、密钥校验和本地验证。
- `seo/url-manifest.json`、`seo/migration-baseline.json` 及 SEO 构建脚本：负责站点地图、规范网址和页面更新日期，不是 IndexNow 提交记录。
- 页面路由、TDK、图片、正文及站点地图生成结构保持不变。

## 站点地图与页面日期

公开页面仍为首页、三个专题页和五个 Legal 页面。路由来自规范路由注册表与公开内容数据，不包含旧的 Games、Guides、草稿或机器接口。

SEO 构建读取实际预渲染 HTML 和核心图片内容，生成语义指纹。没有变化的页面沿用历史更新时间，新增或有实质变化的页面才推进日期。CSS、构建标识和装饰性日期不用于判断内容变化。

生产构建读取正式网站的 SEO Manifest 作为比较基线；本地使用已核实的迁移快照，不推进生产状态。迁移快照保留历史日期，用于站点地图日期维护，不用于记录 IndexNow 是否已经提交。

站点地图保留 `loc`、`lastmod`、`changefreq` 和 `priority`，规范网址与 Canonical、Open Graph 一致。双次预渲染和部署适配器产物读取修复保持不变，不因精简 IndexNow 而移除。

## IndexNow 的后续操作

只有用户明确要求上传 GitHub 时，助手才上传；确认本次提交已成功部署后，按照项目 `AGENTS.md` 的授权自动运行简单提交命令并检查结果。仅本地修改时不提交网址，也不运行定时任务。

提交命令只向固定的 IndexNow 官方接口发送本站规范网址。提交前检查线上密钥文件，不使用 Vercel API 令牌，不写远程仓库，不创建记录分支，不自动重试。返回 200 表示提交成功，202 表示请求已接收、密钥验证待完成；都不代表已经收录。

## 验证

- `npm run test:seo`：语义指纹、日期、站点地图及模拟 IndexNow 请求测试。
- `npm run indexnow:verify-key -- --built`：本地与构建产物密钥校验，不显示密钥。
- `npm run indexnow:submit -- --all --dry-run`：读取线上页面列表并预览，不提交。
- `npm run test:sitemap`、`npm run sitemap:validate`：站点地图与实际渲染产物检查。
- `npm run lint`、`npm run typecheck`：代码规范与类型检查。

旧远程自动流程与 GitHub 配置的清理状态应单独核实。本地删除不代表远程已删除；后续上传仍需用户明确授权。
