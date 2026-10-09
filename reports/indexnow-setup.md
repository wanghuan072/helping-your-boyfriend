# IndexNow 简单配置与使用

正式域名：`https://helpingyourboyfriend.org`。

## 需要什么

只需要现有的 `INDEXNOW_KEY` 和线上根目录的密钥验证文件。密钥已配置在本地忽略的 `.env.local` 及 Vercel 生产环境中，不需要重新生成。

不需要 Vercel API 令牌、GitHub Actions 密钥、团队 ID、提交记录分支或独立存储服务。

## 怎么用

用户已授权后续由助手代为运行：每次用户明确要求上传 GitHub 后，助手确认该次提交已成功部署，再自动提交已上线的变更网址并检查结果，无需用户手动执行。仅本地修改或部署失败时不提交。此约定已记录在项目 `AGENTS.md`，不代表允许自动上传代码。

先正常部署页面更新，再在项目目录运行下面的命令。

只预览全部线上页面，不提交：

```powershell
npm run indexnow:submit -- --all --dry-run
```

提交指定的新增、更新或删除网址（通常使用这个）：

```powershell
npm run indexnow:submit -- /endings /characters
```

首次提交全部线上页面：

```powershell
npm run indexnow:submit -- --all
```

`--all` 读取正式网站的公开 SEO Manifest，只提交其中可索引的规范网址，不使用尚未部署的本地页面列表。日常只提交有变动的网址，不必反复提交全部页面。指定网址支持本站完整网址或以 `/` 开头的路径，不接受其他域名、查询参数、片段或非首页末尾斜杠。

实际提交前，脚本会核对线上密钥文件；匹配后向 IndexNow 官方接口发送一次请求，最多 10,000 个网址。不会写入远程仓库、创建分支、更新页面日期或部署网站，也不会自动重试。

## 如何判断结果

- `dryRun: true`：只预览，没有提交。
- `status: 200`：提交成功，不代表已经抓取或收录。
- `status: 202`：请求已接收，密钥验证待完成，不代表已经收录。
- `403`：IndexNow 无法验证密钥，请检查线上文件。它与旧流程中的 Vercel API 403 是不同问题。
- `429`：提交过于频繁，稍后再试。
- 其他错误：命令失败，不显示密钥，不自动重试。

协议说明：[IndexNow 官方文档](https://www.indexnow.org/documentation)。

## 旧流程的处理

本地已删除旧的 GitHub 自动流程及 Vercel 校验、提交记录脚本，保留站点地图、页面日期维护和密钥文件生成。旧 GitHub 配置暂未远程删除；Vercel 的 `INDEXNOW_KEY` 必须保留。

本轮没有提交 Git、上传 GitHub、部署或实际提交网址。旧的远程自动流程要等用户另行授权上传后才会删除；本地删除不等于线上流程已停止。若远程 `INDEXNOW_ENABLED` 仍为 `true`，应在 GitHub 将它改为 `false`，必要时由用户完成身份验证。
