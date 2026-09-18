<template>
  <div v-if="app" class="animate-fade-in" :style="accentStyle">
    <!-- 产品头部 -->
    <section class="shell pb-2 pt-14 sm:pt-16">
      <div class="flex items-center gap-6 sm:gap-7">
        <AppIcon :app="app" :size="92" class="shrink-0" />
        <div>
          <h1 class="font-serif text-[clamp(1.9rem,5vw,2.8rem)] font-bold leading-tight tracking-tight" style="color: var(--ink)">
            {{ meta.name }}
          </h1>
          <p class="mt-2 text-[15.5px] leading-7" style="color: var(--ink-soft)">{{ meta.tagline }}</p>
          <div class="mt-4 flex flex-wrap items-center gap-3 text-[13px]" style="color: var(--ink-mute)">
            <span class="pill">{{ meta.category }}</span>
            <span>{{ meta.tags }}</span>
          </div>
          <a
            v-if="app.appStoreUrl"
            :href="app.appStoreUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary mt-6"
          >
            {{ t('app.download') }}
          </a>
        </div>
      </div>
    </section>

    <div class="shell">
      <!-- 快速开始 / 常见问题 / 更新日志：页签就地切换 -->
      <div class="grid gap-6 pb-10 pt-2 lg:grid-cols-[150px_1fr] lg:gap-12 lg:pb-16">
        <!-- 左侧页签 -->
        <AppNav v-model="tab" :app="app" />

        <div class="w-full max-w-3xl">
          <AppDocsPanel v-if="tab === 'docs'" :key="`${app.id}-${locale}`" :app="app" />
          <AppFeaturesPanel v-else-if="tab === 'features'" :key="`${app.id}-${locale}`" :app="app" />
          <AppFaqPanel v-else-if="tab === 'faq'" :key="`${app.id}-${locale}`" :app="app" />
          <AppChangelogPanel v-else-if="tab === 'changelog'" :key="`${app.id}-${locale}`" :app="app" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/i18n'
import { getApp } from '@/data/apps'
import { useTheme } from '@/composables/useTheme'
import { useContent } from '@/composables/useContent'
import { usePageMeta } from '@/composables/usePageMeta'
import AppIcon from '@/components/AppIcon.vue'
import AppNav from '@/components/AppNav.vue'
import AppDocsPanel from '@/components/AppDocsPanel.vue'
import AppFaqPanel from '@/components/AppFaqPanel.vue'
import AppFeaturesPanel from '@/components/AppFeaturesPanel.vue'
import AppChangelogPanel from '@/components/AppChangelogPanel.vue'

const route = useRoute()
const { locale, t } = useLocale()
const { isDark } = useTheme()

const app = computed(() => getApp(route.params.app))
const { getAppMeta } = useContent()
const meta = computed(() => (app.value ? getAppMeta(app.value.id, locale.value) : { name: '', tagline: '', category: '', tags: '', repo: '' }))

// 开源应用：产品官网直接跳转其开源平台
if (meta.value.repo) {
  window.location.replace(meta.value.repo)
}

// 页签本地状态：点击只切换下方内容，不路由跳转
const tab = ref('docs')
watch(
  () => route.params.app,
  () => {
    tab.value = 'docs'
  }
)

// 产品页用 app 注册表的强调色覆盖站点默认蓝
function tint(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
const accentStyle = computed(() =>
  app.value
    ? {
        '--accent': app.value.accent,
        '--accent-soft': tint(app.value.accent, isDark.value ? 0.2 : 0.1)
      }
    : {}
)

usePageMeta(
  () => (app.value ? `${meta.value.name} · ${t.value('site.name')}` : t.value('site.name')),
  () => (app.value ? meta.value.tagline : t.value('site.description'))
)
</script>
