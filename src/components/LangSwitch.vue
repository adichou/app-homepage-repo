<template>
  <button class="chip-button" type="button" :aria-label="t('lang.aria')" :title="t('lang.aria')" @click="switchLocale">
    <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" stroke-width="1.4" />
      <path d="M1.75 8h12.5" stroke="currentColor" stroke-width="1.2" />
      <path
        d="M8 1.75c1.75 1.6 2.75 3.85 2.75 6.25S9.75 12.65 8 14.25C6.25 12.65 5.25 10.4 5.25 8S6.25 3.35 8 1.75Z"
        stroke="currentColor"
        stroke-width="1.2"
      />
    </svg>
    <span class="hidden sm:inline">{{ t('lang.switchTo') }}</span>
  </button>
</template>

<script setup>
import { useLocale } from '@/i18n'

const { t, switchLocale } = useLocale()
</script>
