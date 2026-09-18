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
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/i18n'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'

const route = useRoute()
const { setLocale } = useLocale()

// 语言跟随路由（zh 默认无前缀 / en 镜像到 /en/）
watch(
  () => route.meta.locale,
  (locale) => {
    if (locale) setLocale(locale)
  },
  { immediate: true }
)
</script>
