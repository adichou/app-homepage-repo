<template>
  <p v-if="releases.length === 0" class="text-[15px]" style="color: var(--ink-mute)">{{ t('changelog.empty') }}</p>
  <div v-else class="space-y-6">
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
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '@/i18n'
import { useContent } from '@/composables/useContent'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const props = defineProps({
  app: { type: Object, required: true }
})

const { locale, t } = useLocale()
const { getChangelog } = useContent()

const releases = computed(() => getChangelog(props.app.id, locale.value))

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
</script>
