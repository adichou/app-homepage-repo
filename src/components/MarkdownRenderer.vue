<template>
  <article ref="rootEl" class="prose prose-doc max-w-none" v-html="rendered"></article>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-markdown'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

// md 中以 / 开头的站内链接与图片自动加上部署子路径前缀（已含前缀的构建产物 URL 原样返回）
function withBase(url) {
  if (url.startsWith(BASE + '/')) return url
  if (url.startsWith('/') && !url.startsWith('//')) return BASE + url
  return url
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
  // breaks: false —— 使用标准 markdown 段落语义
}).use(markdownItAnchor, {
  permalink: false,
  slugify: (s) => encodeURIComponent(s.trim().toLowerCase().replace(/\s+/g, '-'))
})

// 外链新窗口打开；站内绝对链接补 base
const defaultLinkOpen =
  md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet('href') || ''
  if (/^https?:\/\//i.test(href)) {
    tokens[idx].attrSet('target', '_blank')
    tokens[idx].attrSet('rel', 'noopener noreferrer')
  } else if (href.startsWith('/')) {
    tokens[idx].attrSet('href', withBase(href))
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

// 站内绝对路径图片补 base
const defaultImage =
  md.renderer.rules.image || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const src = tokens[idx].attrGet('src') || ''
  if (src.startsWith('/') && !src.startsWith('//')) {
    tokens[idx].attrSet('src', withBase(src))
  }
  return defaultImage(tokens, idx, options, env, self)
}

// 代码块：Prism 高亮，未识别语言时安全转义
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const langName = (token.info || '').trim().split(/\s+/)[0]

  if (langName && Prism.languages[langName]) {
    try {
      const highlighted = Prism.highlight(token.content, Prism.languages[langName], langName)
      return `<pre class="language-${langName}"><code class="language-${langName}">${highlighted}</code></pre>`
    } catch (err) {
      console.warn('Prism highlighting failed:', err)
    }
  }
  return `<pre><code>${md.utils.escapeHtml(token.content)}</code></pre>`
}

const rendered = computed(() => {
  if (!props.content) return ''
  return md.render(props.content)
})

// 将正文中的 .svg 图片内联为 SVG 元素，
// 使 SVG 内部的 var(--diag-*) 颜色跟随站点深浅色主题（<img> 方式无法穿透 CSS 变量）
const rootEl = ref(null)

async function inlineSvgDiagrams() {
  const el = rootEl.value
  if (!el) return
  await nextTick()
  for (const img of [...el.querySelectorAll('img[src$=".svg"]')]) {
    try {
      const res = await fetch(img.getAttribute('src'))
      if (!res.ok) continue
      const text = await res.text()
      if (!text.trim().startsWith('<svg')) continue
      const holder = document.createElement('div')
      holder.className = 'svg-diagram'
      holder.setAttribute('role', 'img')
      if (img.alt) holder.setAttribute('aria-label', img.alt)
      holder.innerHTML = text
      img.replaceWith(holder)
    } catch {
      // 拉取失败时保留原 img 展示
    }
  }
}

onMounted(inlineSvgDiagrams)
watch(() => props.content, inlineSvgDiagrams)
</script>
