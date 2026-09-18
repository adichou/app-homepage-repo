<template>
  <div v-if="app" class="shell animate-fade-in pb-16">
    <div class="mx-auto w-full max-w-3xl">
      <div v-if="record" class="pt-12">
        <MarkdownRenderer :content="record.content" />
      </div>
      <p v-else class="pt-12 text-[15px]" style="color: var(--ink-mute)">{{ t('legal.notFound') }}</p>
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

usePageMeta(
  () =>
    `${t.value(`legal.${legalType.value}Title`)} · ${appName.value} · ${t.value('site.name')}`,
  () => app.value?.tagline || t.value('site.description')
)
</script>
