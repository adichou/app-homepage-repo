<template>
  <div class="animate-fade-in">
    <!-- 工作室介绍 -->
    <section class="shell pb-4 pt-4 sm:pt-6">
      <h1 class="font-serif text-[clamp(1.8rem,4.5vw,2.75rem)] font-bold leading-[1.15] tracking-tight" style="color: var(--ink)">
        {{ t('portal.heroLine1') }}<br />
        {{ t('portal.heroLine2') }}
      </h1>
      <p class="mt-6 max-w-3xl text-[15.5px] leading-8" style="color: var(--ink-soft)">
        {{ t('portal.intro') }}{{ t('portal.blogLead') }}<a
          :href="t('portal.blogUrl')"
          target="_blank"
          rel="noopener noreferrer"
          style="color: var(--accent)"
        >{{ t('portal.blogUrl') }}</a>
      </p>
    </section>

    <!-- 全部应用（平铺） -->
    <section id="apps" class="shell scroll-mt-20 pb-16 pt-14">
      <div class="grid gap-5">
        <AppCard v-for="app in apps" :key="app.id" :app="app" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useLocale } from '@/i18n'
import { apps } from '@/data/apps'
import AppCard from '@/components/AppCard.vue'
import { usePageMeta } from '@/composables/usePageMeta'

const { t } = useLocale()

usePageMeta(
  () => `${t.value('site.name')} · ${t.value('site.wordmarkSuffix')}`,
  () => t.value('site.description')
)
</script>
