<template>
  <div v-if="app" class="shell animate-fade-in pb-16">
    <div class="mx-auto w-full max-w-3xl">
      <header class="pt-12">
        <SectionLabel num="·" :label="t(`legal.${legalType}Eyebrow`)" />
        <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight" style="color: var(--ink)">
          {{ t(`legal.${legalType}Title`) }}
        </h1>
        <p v-if="record" class="mt-3 text-[13.5px]" style="color: var(--ink-mute)">
          {{ t('legal.updated') }} · {{ formatDate(record.meta.updated) }}
        </p>
      </header>

      <div v-if="record" class="mt-8">
        <MarkdownRenderer :content="record.content" />
      </div>
      <p v-else class="mt-10 text-[15px]" style="color: var(--ink-mute)">{{ t('legal.notFound') }}</p>
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
const { getSection } = useContent()

const app = computed(() => getApp(route.params.app))
const { appName } = useAppMeta(app)
const legalType = computed(() => route.meta.legal || 'privacy')
const record = computed(() =>
  app.value ? getSection(app.value.id, legalType.value, locale.value) : null
)

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
  () =>
    `${t.value(`legal.${legalType.value}Title`)} · ${appName.value} · ${t.value('site.name')}`,
  () => app.value?.tagline || t.value('site.description')
)
</script>
