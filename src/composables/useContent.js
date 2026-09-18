// 内容引擎：content/<app>/<locale>/<slug>.md
// - 应用元信息（名称/副标题/标签）：<locale>/index.md 的 frontmatter
// - 更新日志：<locale>/changelog/<slug>.md
// - 图标与图片：<locale>/image/*
// 按 app / locale 建立索引，缺语言时回落（当前语言 → zh → en）。

const modules = import.meta.glob('/content/**/*.md', { as: 'raw', eager: true })

// 图片资源：构建时由 Vite 输出为带 hash 的静态文件，值为可访问 URL
const imageModules = import.meta.glob('/content/**/image/*', { eager: true, query: '?url', import: 'default' })

// 内容目录名 → 应用 id 映射（目录名与仓库一致，应用 id 保持 URL 稳定）
const APP_DIR_ALIASES = {
  'cam-media-man-mobile': 'camman'
}
const APP_ID_TO_DIR = Object.fromEntries(Object.entries(APP_DIR_ALIASES).map(([dir, id]) => [id, dir]))

// ---------- frontmatter 解析 ----------

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw }

  const meta = {}
  match[1].split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':')
    if (colonIndex <= 0) return
    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^["']|["']$/g, ''))
        .filter((item) => item.length > 0)
    }
    if (value === 'true') value = true
    if (value === 'false') value = false

    meta[key] = value
  })

  return { meta, content: match[2].replace(/^\n+/, '') }
}

// /content/camman/zh/privacy.md            → { app, locale: 'zh', dir: '', slug: 'privacy' }
// /content/camman/zh/index.md              → { app, locale: 'zh', dir: '', slug: 'index' }
// /content/camman/zh/changelog/v1.0.0.md   → { app, locale: 'zh', dir: 'changelog', slug: 'v1.0.0' }
function parsePath(path) {
  const normalized = path.replace(/^\/content\//, '').replace(/\.md$/, '')
  const parts = normalized.split('/')
  const dir = APP_DIR_ALIASES[parts[0]] || parts[0]
  const locale = parts[1]
  const slug = parts[parts.length - 1]
  const subDir = parts.length === 4 ? parts[2] : ''
  return { app: dir, locale, dir: subDir, slug }
}

// ---------- 建立索引 ----------

const records = Object.entries(modules).map(([path, raw]) => {
  const { meta, content } = parseFrontmatter(raw)
  return { path, ...parsePath(path), meta, content }
})

const LOCALE_FALLBACK = (locale) => [locale, 'zh', 'en']

// 正文 md 中 image/<file> 相对引用 → 构建后的图片 URL（带语言回落）
function withImageUrls(dirName, locale, content) {
  return content.replace(/\]\(image\/([^)\s]+)\)/g, (matched, file) => {
    for (const candidate of LOCALE_FALLBACK(locale)) {
      const url = imageModules[`/content/${dirName}/${candidate}/image/${file}`]
      if (url) return `](${url})`
    }
    return matched
  })
}

function findRecord(app, slug, dir, locale) {
  for (const candidate of LOCALE_FALLBACK(locale)) {
    const record = records.find(
      (r) => r.app === app && r.slug === slug && r.dir === dir && r.locale === candidate
    )
    if (record) {
      const dirName = APP_ID_TO_DIR[record.app] || record.app
      return {
        ...record,
        content: withImageUrls(dirName, candidate, record.content),
        fallbackLocale: candidate !== locale ? candidate : null
      }
    }
  }
  return null
}

// ---------- 对外 API ----------

export function useContent() {
  // 应用元信息：<locale>/index.md frontmatter（name/tagline/category/tags/repo）
  function getAppMeta(app, locale) {
    const record = findRecord(app, 'index', '', locale)
    if (!record) return { name: app, tagline: '', category: '', tags: '', repo: '' }
    return {
      name: record.meta.name || app,
      tagline: record.meta.tagline || '',
      category: record.meta.category || '',
      tags: Array.isArray(record.meta.tags) ? record.meta.tags.join(' · ') : String(record.meta.tags || ''),
      repo: String(record.meta.repo || '')
    }
  }

  // 应用图标：<locale>/image/icon.*
  function getIconUrl(app, locale) {
    const dir = APP_ID_TO_DIR[app] || app
    for (const candidate of LOCALE_FALLBACK(locale)) {
      const key = Object.keys(imageModules).find(
        (k) => k.startsWith(`/content/${dir}/${candidate}/image/icon.`)
      )
      if (key) return imageModules[key]
    }
    return ''
  }

  // 单文件区块：privacy / support
  function getSection(app, section, locale) {
    return findRecord(app, section, '', locale)
  }

  // 文档显示标题以正文第一个一级标题为准，缺省时回退 frontmatter title / slug
  function extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : null
  }

  // 文档列表（<locale>/ 下除 index/faq/features 外的 md），按 frontmatter order 升序
  function getDocs(app, locale) {
    return records
      .filter(
        (r) =>
          r.app === app && r.locale === locale && r.dir === '' &&
          r.slug !== 'index' && r.slug !== 'faq' && r.slug !== 'features'
      )
      .sort((a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99) || String(a.meta.title).localeCompare(String(b.meta.title)))
      .map((r) => ({ slug: r.slug, title: extractTitle(r.content) || r.meta.title || r.slug, order: r.meta.order ?? 99 }))
  }

  function getDoc(app, slug, locale) {
    return findRecord(app, slug, '', locale)
  }

  // 更新日志：<locale>/changelog/，按日期倒序，同日按版本号倒序
  function getChangelog(app, locale) {
    return records
      .filter((r) => r.app === app && r.locale === locale && r.dir === 'changelog')
      .sort(
        (a, b) =>
          String(b.meta.date ?? '').localeCompare(String(a.meta.date ?? '')) ||
          compareVersions(String(b.meta.version ?? ''), String(a.meta.version ?? ''))
      )
  }

  // FAQ：<locale>/faq.md，按 “## 问题” 切分为条目
  function getFaqEntries(app, locale) {
    const record = findRecord(app, 'faq', '', locale)
    if (!record) return { intro: '', entries: [] }

    const chunks = record.content.split(/(?=^##\s)/m)
    // 首块去掉 h1 标题行后作为引导语
    const intro = chunks[0].replace(/^#\s+.*\n?/, '').trim()
    const entries = chunks.slice(1).map((chunk) => {
      const [heading, ...rest] = chunk.split('\n')
      return {
        question: heading.replace(/^##\s+/, '').trim(),
        answer: rest.join('\n').trim()
      }
    })
    return { intro, entries }
  }

  return { getAppMeta, getIconUrl, getSection, getDocs, getDoc, getChangelog, getFaqEntries }
}

function compareVersions(a, b) {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0)
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pb[i] || 0) - (pa[i] || 0)
    if (diff !== 0) return diff
  }
  return 0
}
