<template>
  <button class="chip-button" type="button" :aria-label="t('lang.aria')" @click="switchLocale">
    {{ t('lang.switchTo') }}
  </button>
</template>

<script setup>
import { useLocale } from '@/i18n'

const { t, switchLocale } = useLocale()
</script>
