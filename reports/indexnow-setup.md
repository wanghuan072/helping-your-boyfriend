# IndexNow 配置说明

目标仓库：`wanghuan072/helping-your-boyfriend`。Vercel 项目：`helping-your-boyfriend-9jzf`。正式域名：`https://helpingyourboyfriend.org`。

## 已完成并核实

- GitHub 仓库变量 `VERCEL_PROJECT_ID` 和 `SITE_URL` 已保存。
- Vercel 生产环境的 `INDEXNOW_KEY` 已保存。线上根目录的密钥验证文件返回 200，内容与现有本地密钥一致。
- 线上站点地图、robots 文件及公开的 SEO Manifest 均返回 200。
- 新版提交记录流程仅在本地完成，尚未上传，未创建远程记录分支，也未实际向 IndexNow 提交网址。

## 尚需完成的配置

1. 打开 GitHub 仓库的 Settings（设置）→ Secrets and variables（密钥与变量）→ Actions → Secrets（密钥），新增 `INDEXNOW_KEY`。填写现有 `.env.local` 中的密钥，必须与 Vercel 一致。不要重新生成密钥，也不要把 `.env.local` 提交到 Git。
2. 新增密钥 `VERCEL_READ_TOKEN`，仅授予读取本项目部署、项目及域名信息所需的权限。请在平台安全创建和填写凭证，不要发到聊天里。如果平台无法提供所需的最小权限，应先确认替代方案，不直接使用权限过大的账号令牌。
3. 如果凭证或项目需要指定团队，在 GitHub 仓库的 Variables（变量）中新增 `VERCEL_TEAM_ID`。填写实际团队 ID，不要用团队页面网址中的名称代替。
4. 如果经过核实的部署网址受到访问保护，配置本项目专用的密钥 `VERCEL_AUTOMATION_BYPASS_SECRET`，不要关闭部署保护。
5. 另行授权上传新版流程。流程仅在提交任务中使用临时 `GITHUB_TOKEN` 的 `contents: write` 权限，无需个人 GitHub 令牌、独立存储服务、存储地址或存储令牌。保留主分支保护，确认仓库规则允许任务写入固定的记录分支 `indexnow-checkpoints`。该分支只保存提交记录，应避免让 Vercel 对它进行预览构建。
6. 前述配置验证通过后，在 GitHub 仓库变量中设置 `INDEXNOW_ENABLED=true`。首次手动运行流程，填写已核实的当前成功生产部署 ID 和项目 ID，并设置 `bootstrap=true`，初始化提交记录。检查实际提交结果及记录分支。之后，成功的生产部署事件会自动触发差异提交。

## 验收与故障恢复

- `Skipped` 表示任务被跳过，不代表已经提交。首次初始化成功后，应显示已接受的网址数量，并在记录分支中创建 `<project-id>-production.json`。
- 只有 IndexNow 返回 200 或 202 才算接受请求，不代表已经抓取或收录。
- 所有提交批次成功后才能保存新记录。更新必须基于此前读取的准确提交版本进行快进更新，禁止强制推送。
- 遇到并发写入冲突，重新运行以读取最新记录。部分批次提交失败时，旧记录保持不变，可以重试。
- 不要删除记录分支。如果提交过网址后记录丢失，应先恢复再继续；旧的迁移快照无法恢复之后所有被删除的网址。
- 记录分支只保存公开的网址元数据，不保存 IndexNow、Vercel 或 GitHub 令牌。
