# App Homepage Repository

ALDi Studio 全部应用的官网仓库：产品主页、安装与用户文档、FAQ、公开更新日志、支持入口、隐私政策与用户协议、公开素材。

App Store Connect 元信息、审核备注、审核截图、订阅配置和发布检查清单不放在这里；这些材料保存在私有的 `app-info-repo`。App 源代码保存在各自的源码仓库。

在线地址：<https://adichou.github.io/app-homepage-repo/>

## 技术架构

与 `myblog` 同一套架构：**Vue 3 + Vite + Vue Router + Tailwind CSS** 的单页应用（SPA），内容为 markdown 文件，构建时打包、浏览器端渲染（markdown-it + Prism）。

- 中文为默认语言（无 URL 前缀），英文镜像到 `/en/`；首次访问按浏览器语言自动跳转一次，手动切换后记住选择（`localStorage`）
- 深浅色三态切换（跟随系统 → 浅色 → 深色），首帧前由 `index.html` 内联脚本应用，无闪烁
- SPA 深链路由由 `dist/404.html` 回退承载（构建时自动复制）

## 目录约定

```
content/<appId>/            内容真源（唯一来源，不再手写 html）
├── privacy.zh.md / privacy.en.md          隐私政策全文
├── terms.zh.md   / terms.en.md            用户协议与订阅说明
├── support.zh.md / support.en.md          支持渠道（渲染进全局支持页）
├── faq.zh.md     / faq.en.md              FAQ（“## 问题” 切分为条目）
├── docs/<slug>.zh.md / <slug>.en.md       用户文档（frontmatter: title, order）
└── changelog/v1.0.0.zh.md / …            更新日志（frontmatter: version, date）

src/data/apps.js            App 注册表（名称/标语/强调色/hero 文案/隐私摘要等）
public/                     静态资源（favicon、robots、旧链接重定向桩）
public/aldistudio.cam-media-man-mobile/   旧 URL 重定向桩（见下）
```

## 新增一款 App

1. 在 `src/data/apps.js` 追加注册表条目（id、分类、双语名称/标语、强调色、hero 文案等）
2. 在 `content/<id>/` 放入各区块 md（至少 `privacy.*.md`）
3. 完成——所有页面（产品页/文档/FAQ/日志/法律页/支持页/门户分组）自动生成，无需写页面代码

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000/app-homepage-repo/
npm run build      # 产物在 dist/
npm run format:content   # 中文与西文之间自动加空格（content/ 目录）
```

## 部署（GitHub Pages + Actions）

推送 `main` 后 `.github/workflows/deploy.yml` 自动构建并发布。**前置条件（一次性）**：仓库 Settings → Pages → Build and deployment → Source 需选择 **GitHub Actions**（不再是分支部署）。

首次启用时序：推送代码 → 切换 Pages 来源为 GitHub Actions →（如未自动触发）Actions 页面手动 Run workflow。切换完成前旧页面保持在线，切换后旧链接由重定向桩接管。

## 旧链接兼容（已提交 App Store Connect 的 URL 勿删）

| 旧 URL | 跳转到 |
|---|---|
| `/aldistudio.cam-media-man-mobile/` | `/apps/camman/` |
| `/aldistudio.cam-media-man-mobile/privacy-zh-Hans.html` | `/apps/camman/privacy` |
| `/aldistudio.cam-media-man-mobile/privacy-en-US.html` | `/en/apps/camman/privacy` |

重定向桩位于 `public/aldistudio.cam-media-man-mobile/`，meta refresh + canonical 实现。

## Apps

- [CamMan 助手 / CamMan ZhuShou](https://adichou.github.io/app-homepage-repo/apps/camman/) — 相机卡安全导出、素材整理与拍摄参考（iPhone · iPad）
