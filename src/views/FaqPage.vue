<template>
  <div v-if="app" class="shell animate-fade-in pb-16">
    <div class="mx-auto w-full max-w-3xl">
      <header class="pt-12">
        <SectionLabel num="·" :label="t('faq.eyebrow')" />
        <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight" style="color: var(--ink)">{{ t('faq.title') }}</h1>
        <p v-if="faq.intro" class="mt-4 text-[15px] leading-7" style="color: var(--ink-mute)">{{ faq.intro }}</p>
      </header>

      <p v-if="faq.entries.length === 0" class="mt-10 text-[15px]" style="color: var(--ink-mute)">{{ t('faq.empty') }}</p>

      <div v-else class="mt-8 space-y-4">
        <details
          v-for="(entry, index) in faq.entries"
          :key="entry.question"
          class="faq-item card-editorial px-6 py-4"
          :open="index === 0"
        >
          <summary class="flex items-center justify-between gap-4 py-1.5">
            <h2 class="font-serif text-[16.5px] font-bold leading-7 tracking-tight" style="color: var(--ink)">
              {{ entry.question }}
            </h2>
            <svg class="chevron h-3.5 w-3.5 flex-none" style="color: var(--ink-mute)" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M5.5 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </summary>
          <div class="pb-3 pt-1">
            <MarkdownRenderer :content="entry.answer" />
          </div>
        </details>
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
const { getFaqEntries } = useContent()

const app = computed(() => getApp(route.params.app))
const { appName } = useAppMeta(app)
const faq = computed(() => (app.value ? getFaqEntries(app.value.id, locale.value) : { intro: '', entries: [] }))

usePageMeta(
  () => `${t.value('faq.title')} · ${appName.value} · ${t.value('site.name')}`,
  () => app.value?.tagline || t.value('site.description')
)
</script>
