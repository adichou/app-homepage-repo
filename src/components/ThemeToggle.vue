<template>
  <button
    class="chip-button"
    type="button"
    :aria-label="`${t('theme.label')}: ${modeLabel}`"
    :title="`${t('theme.label')}: ${modeLabel}`"
    @click="cycle"
  >
    <svg v-if="preference === 'auto'" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" stroke-width="1.4" />
      <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5Z" fill="currentColor" />
    </svg>
    <svg v-else-if="preference === 'light'" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.4" />
      <path
        d="M8 .8v1.8M8 13.4v1.8M.8 8h1.8M13.4 8h1.8M2.9 2.9l1.3 1.3M11.8 11.8l1.3 1.3M13.1 2.9l-1.3 1.3M4.2 11.8l-1.3 1.3"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </svg>
    <svg v-else class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.6 1.6a6.3 6.3 0 1 0 4.8 6.1A5.1 5.1 0 0 1 9.6 1.6Z"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linejoin="round"
      />
    </svg>
    <span class="hidden sm:inline">{{ modeLabel }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/i18n'

const { preference, cycle } = useTheme()
const { t } = useLocale()

const modeLabel = computed(() =>
  ({ auto: t.value('theme.auto'), light: t.value('theme.light'), dark: t.value('theme.dark') }[preference.value] ||
  preference.value)
)
</script>
