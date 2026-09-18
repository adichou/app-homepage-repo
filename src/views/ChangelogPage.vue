<template>
  <div v-if="app" class="shell animate-fade-in pb-16">
    <div class="mx-auto w-full max-w-3xl">
      <header class="pt-12">
        <SectionLabel num="·" :label="t('changelog.eyebrow')" />
        <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight" style="color: var(--ink)">{{ t('changelog.title') }}</h1>
      </header>

      <p v-if="releases.length === 0" class="mt-10 text-[15px]" style="color: var(--ink-mute)">{{ t('changelog.empty') }}</p>

      <div v-else class="mt-8 space-y-6">
        <article v-for="(release, index) in releases" :key="release.meta.version" class="card-editorial p-6 sm:p-8">
          <header class="flex flex-wrap items-center gap-3">
            <span class="font-mono text-[15px] font-semibold" style="color: var(--accent)">{{ release.meta.version }}</span>
            <span class="text-[13px]" style="color: var(--ink-mute)">{{ formatDate(release.meta.date) }}</span>
            <span v-if="index === 0" class="pill">{{ t('changelog.latest') }}</span>
          </header>
          <div class="mt-3">
            <MarkdownRenderer :content="release.content" />
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/i18n'
import { getApp } from '@/data/apps'
import { useContent } from '@/composables/useContent'
import { useAppMeta } from '@/composables/useAppMeta'
import { usePageMeta } from '@/composables/usePageMeta'
import SectionLabel from '@/components/SectionLabel.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const route = useRoute()
const { locale, t } = useLocale()
const { getChangelog } = useContent()

const app = computed(() => getApp(route.params.app))
const { appName } = useAppMeta(app)
const releases = computed(() => (app.value ? getChangelog(app.value.id, locale.value) : []))

function formatDate(value) {
  if (!value) return ''
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString(locale.value === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

usePageMeta(
  () => `${t.value('changelog.title')} · ${appName.value} · ${t.value('site.name')}`,
  () => app.value?.tagline || t.value('site.description')
)
</script>
