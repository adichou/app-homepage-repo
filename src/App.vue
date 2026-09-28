<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />

    <!-- 全站支持入口：固定右下角（桌面端与主题切换按钮右缘对齐） -->
    <RouterLink
      :to="{ name: supportName }"
      class="support-fab fixed z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
      style="background: var(--panel); border: 1px solid var(--line); color: var(--accent)"
      :aria-label="t('nav.support')"
      :title="t('nav.support')"
    >
      <svg class="h-5 w-5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 2.2a5.3 5.3 0 1 1-4.35 8.35L2.3 13.7l.85-3.25A5.3 5.3 0 0 1 8 2.2Z"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linejoin="round"
        />
        <circle cx="5.9" cy="7.5" r="0.85" fill="currentColor" />
        <circle cx="8" cy="7.5" r="0.85" fill="currentColor" />
        <circle cx="10.1" cy="7.5" r="0.85" fill="currentColor" />
      </svg>
    </RouterLink>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/i18n'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'

const route = useRoute()
const { t, setLocale } = useLocale()

const supportName = computed(() => `support${route.meta.locale === 'en' ? '-en' : ''}`)

// 语言跟随路由（zh 默认无前缀 / en 镜像到 /en/）
watch(
  () => route.meta.locale,
  (locale) => {
    if (locale) setLocale(locale)
  },
  { immediate: true }
)
</script>

<style scoped>
/* 移动端贴近屏幕右缘；桌面端与 .shell 内容右缘（即主题切换按钮右缘）对齐 */
.support-fab {
  bottom: 1.25rem;
  right: 1.25rem;
}
@media (min-width: 640px) {
  .support-fab {
    right: calc(max((100vw - 60rem) / 2, 0px) + 2rem);
  }
}
</style>
