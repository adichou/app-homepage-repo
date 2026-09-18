<template>
  <div v-if="app" class="shell animate-fade-in pb-16">
    <div class="mx-auto w-full max-w-4xl">
      <header class="pt-12">
        <SectionLabel num="·" :label="t('docs.eyebrow')" />
        <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight" style="color: var(--ink)">{{ t('docs.title') }}</h1>
      </header>

      <!-- 空状态 / 未找到 -->
      <p v-if="docsList.length === 0" class="mt-10 text-[15px]" style="color: var(--ink-mute)">{{ t('docs.empty') }}</p>

      <div v-else class="mt-8 grid gap-10 lg:grid-cols-[210px_1fr]">
        <!-- 目录：桌面侧栏 / 移动端横向 -->
        <aside class="hidden lg:block">
          <nav class="sticky top-20 space-y-1" :aria-label="t('docs.contents')">
            <p class="eyebrow !justify-start mb-3"><span>{{ t('docs.contents') }}</span></p>
            <RouterLink
              v-for="doc in docsList"
              :key="doc.slug"
              :to="`${prefix}/docs/${doc.slug}`"
              class="block rounded-md px-3 py-2 text-[13.5px] leading-6 transition-colors docs-link"
              :class="{ active: doc.slug === currentSlug }"
            >
              {{ doc.title }}
            </RouterLink>
          </nav>
        </aside>

        <div>
          <!-- 移动端目录 -->
          <nav v-if="currentSlug" class="mb-8 flex gap-2 overflow-x-auto pb-1 lg:hidden" :aria-label="t('docs.contents')">
            <RouterLink
              v-for="doc in docsList"
              :key="doc.slug"
              :to="`${prefix}/docs/${doc.slug}`"
              class="flex-none rounded-full border px-3.5 py-1.5 text-[13px] transition-colors"
              :style="mobileLinkStyle(doc.slug === currentSlug)"
            >
              {{ doc.title }}
            </RouterLink>
          </nav>

          <template v-if="doc">
            <MarkdownRenderer :content="doc.content" />

            <!-- 上一篇 / 下一篇 -->
            <nav v-if="prevDoc || nextDoc" class="mt-14 flex items-stretch justify-between gap-4" :aria-label="t('docs.contents')">
              <RouterLink v-if="prevDoc" :to="`${prefix}/docs/${prevDoc.slug}`" class="card-editorial flex-1 p-4 text-left transition-transform hover:-translate-y-0.5">
                <span class="text-[11px] uppercase tracking-widest" style="color: var(--ink-mute)">{{ t('docs.prev') }}</span>
                <span class="mt-1 block font-serif text-[15px] font-bold" style="color: var(--ink)">{{ prevDoc.title }}</span>
              </RouterLink>
              <span v-else class="flex-1"></span>
              <RouterLink v-if="nextDoc" :to="`${prefix}/docs/${nextDoc.slug}`" class="card-editorial flex-1 p-4 text-right transition-transform hover:-translate-y-0.5">
                <span class="text-[11px] uppercase tracking-widest" style="color: var(--ink-mute)">{{ t('docs.next') }}</span>
                <span class="mt-1 block font-serif text-[15px] font-bold" style="color: var(--ink)">{{ nextDoc.title }}</span>
              </RouterLink>
            </nav>
          </template>

          <p v-else-if="route.params.slug" class="mt-10 text-[15px]" style="color: var(--ink-mute)">{{ t('docs.notFound') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocale } from '@/i18n'
import { getApp } from '@/data/apps'
import { useContent } from '@/composables/useContent'
import { useAppMeta } from '@/composables/useAppMeta'
import { usePageMeta } from '@/composables/usePageMeta'
import SectionLabel from '@/components/SectionLabel.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const { locale, t } = useLocale()
const { getDocs, getDoc } = useContent()

const app = computed(() => getApp(route.params.app))
const { appName } = useAppMeta(app)
const prefix = computed(() => (locale.value === 'en' ? `/en/apps/${app.value?.id}` : `/apps/${app.value?.id}`))

const docsList = computed(() => (app.value ? getDocs(app.value.id, locale.value) : []))
const currentSlug = computed(() => route.params.slug || null)
const doc = computed(() =>
  app.value && currentSlug.value ? getDoc(app.value.id, currentSlug.value, locale.value) : null
)

const currentIndex = computed(() =>
  currentSlug.value ? docsList.value.findIndex((d) => d.slug === currentSlug.value) : -1
)
const prevDoc = computed(() => (currentIndex.value > 0 ? docsList.value[currentIndex.value - 1] : null))
const nextDoc = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < docsList.value.length - 1
    ? docsList.value[currentIndex.value + 1]
    : null
)

// 无 slug 的 /docs 路由重定向到第一篇文档
watch(
  () => [route.name, docsList.value.length],
  () => {
    if (route.name?.toString().startsWith('app-docs-index') && docsList.value.length > 0) {
      router.replace(`${prefix.value}/docs/${docsList.value[0].slug}`)
    }
  },
  { immediate: true }
)

function mobileLinkStyle(active) {
  return active
    ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
    : { borderColor: 'var(--line)', color: 'var(--ink-soft)' }
}

usePageMeta(
  () => {
    const docTitle = doc.value?.meta.title || t.value('docs.title')
    return `${docTitle} · ${appName.value} · ${t.value('site.name')}`
  },
  () => app.value?.tagline || t.value('site.description')
)
</script>

<style scoped>
.docs-link {
  color: var(--ink-soft);
}
.docs-link:hover {
  color: var(--accent);
}
.docs-link.active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
}
</style>
