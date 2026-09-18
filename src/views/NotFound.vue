<template>
  <div class="shell animate-fade-in">
    <div class="mx-auto flex min-h-[52vh] w-full max-w-2xl flex-col items-start justify-center py-20">
      <p class="font-mono text-[13px]" style="color: var(--accent)">404</p>
      <h1 class="mt-4 font-serif text-3xl font-bold tracking-tight" style="color: var(--ink)">{{ t('common.notFoundTitle') }}</h1>
      <p class="mt-4 text-[15px] leading-7" style="color: var(--ink-mute)">{{ t('common.notFoundBody') }}</p>
      <RouterLink :to="{ name: portalName }" class="btn-primary mt-8">{{ t('common.backHome') }}</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/i18n'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const { t } = useLocale()
const portalName = computed(() => `portal${route.meta.locale === 'en' ? '-en' : ''}`)

usePageMeta(() => `${t.value('common.notFoundTitle')} · ${t.value('site.name')}`)
</script>
