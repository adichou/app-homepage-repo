<template>
  <button class="chip-button" type="button" :aria-label="t('lang.aria')" :title="t('lang.aria')" @click="switchLocale">
    <span class="flex h-3.5 w-3.5 items-center justify-center text-[11px] font-bold leading-none" aria-hidden="true">
      {{ locale === 'zh' ? 'EN' : '中' }}
    </span>
    <span class="hidden sm:inline">{{ t('lang.switchTo') }}</span>
  </button>
</template>

<script setup>
import { useLocale } from '@/i18n'

const { t, locale, switchLocale } = useLocale()
</script>
