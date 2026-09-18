<template>
  <header class="sticky top-0 z-40 backdrop-blur-md" :style="{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }">
    <div class="shell flex h-14 items-center justify-between gap-4">
      <RouterLink :to="{ name: portalName }" class="group flex items-baseline gap-2">
        <span class="font-serif text-[17px] font-bold tracking-tight" style="color: var(--ink)">{{ t('site.name') }}</span>
        <span class="text-[11px] uppercase" style="color: var(--ink-mute); letter-spacing: 0.18em">{{ t('site.wordmarkSuffix') }}</span>
      </RouterLink>

      <nav class="flex items-center gap-5" :aria-label="t('nav.home')">
        <!-- 应用下拉菜单：按分类分组列出全部应用 -->
        <div class="relative hidden sm:block" @mouseenter="appsOpen = true" @mouseleave="appsOpen = false">
          <button
            type="button"
            class="nav-link flex items-center gap-1 text-[13.5px]"
            :class="{ 'router-link-active': appsOpen }"
            aria-haspopup="true"
            :aria-expanded="appsOpen"
            @click="appsOpen = !appsOpen"
          >
            {{ t('nav.apps') }}
            <svg class="h-3 w-3 transition-transform" :class="{ 'rotate-180': appsOpen }" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <transition name="dd">
            <div v-if="appsOpen" class="absolute left-1/2 top-full w-[20rem] -translate-x-1/2 pt-2">
              <div class="overflow-hidden rounded-xl shadow-lg" style="background: var(--panel); border: 1px solid var(--line)">
                <template v-for="(group, gi) in appGroups" :key="group.category">
                  <div v-if="gi > 0" style="border-top: 1px solid var(--line)"></div>
                  <div class="px-3 pb-1 pt-2.5 text-[11px] uppercase tracking-widest" style="color: var(--ink-mute)">
                    {{ t(`portal.categories.${group.category}`) }}
                  </div>
                  <component
                    :is="appMeta(app).repo ? 'a' : RouterLink"
                    v-for="app in group.apps"
                    :key="app.id"
                    v-bind="
                      appMeta(app).repo
                        ? { href: appMeta(app).repo, target: '_blank', rel: 'noopener noreferrer' }
                        : { to: { name: appHomeName, params: { app: app.id } } }
                    "
                    class="app-item flex items-center gap-3 px-3 py-2"
                    @click="appsOpen = false"
                  >
                    <AppIcon :app="app" :size="30" />
                    <span class="min-w-0">
                      <span class="block text-[13.5px] font-medium leading-5" style="color: var(--ink)">{{ appName(app) }}</span>
                    </span>
                  </component>
                </template>
              </div>
            </div>
          </transition>
        </div>
        <RouterLink :to="{ name: supportName }" class="nav-link">{{ t('nav.support') }}</RouterLink>
        <div class="flex items-center gap-2">
          <LangSwitch />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLocale } from '@/i18n'
import { appsByCategory } from '@/data/apps'
import { useContent } from '@/composables/useContent'
import AppIcon from '@/components/AppIcon.vue'
import LangSwitch from '@/components/LangSwitch.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const { t, locale } = useLocale()
const { getAppMeta } = useContent()

function appMeta(app) {
  return getAppMeta(app.id, locale.value)
}

function appName(app) {
  return appMeta(app).name
}

const suffix = computed(() => (route.meta.locale === 'en' ? '-en' : ''))
const portalName = computed(() => `portal${suffix.value}`)
const supportName = computed(() => `support${suffix.value}`)
const appHomeName = computed(() => `app-home${suffix.value}`)

const appsOpen = ref(false)
const appGroups = appsByCategory()

// 路由变化（含前进后退）时收起菜单
watch(
  () => route.fullPath,
  () => {
    appsOpen = false
  }
)
</script>

<style scoped>
.app-item:hover {
  background: color-mix(in srgb, var(--ink) 6%, transparent);
}

.dd-enter-active,
.dd-leave-active {
  transition: opacity 0.15s ease;
}
.dd-enter-from,
.dd-leave-to {
  opacity: 0;
}
</style>
