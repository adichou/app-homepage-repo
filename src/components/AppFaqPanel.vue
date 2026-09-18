<template>
  <p v-if="faq.entries.length === 0" class="text-[15px]" style="color: var(--ink-mute)">{{ t('faq.empty') }}</p>
  <div v-else>
    <p v-if="faq.intro" class="mb-6 text-[15px] leading-7" style="color: var(--ink-mute)">{{ faq.intro }}</p>
    <div class="space-y-4">
      <details v-for="(entry, index) in faq.entries" :key="entry.question" class="faq-item card-editorial px-6 py-4" :open="index === 0">
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
const { getFaqEntries } = useContent()

const faq = computed(() => getFaqEntries(props.app.id, locale.value) || { intro: '', entries: [] })
</script>
