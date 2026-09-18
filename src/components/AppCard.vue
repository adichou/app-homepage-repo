<template>
  <!-- 开源应用：卡片直接外链其开源仓库；其余进入站内产品页 -->
  <component
    :is="meta.repo ? 'a' : RouterLink"
    v-bind="cardAttrs"
    class="card-editorial group flex flex-col gap-2.5 p-4 transition-transform hover:-translate-y-0.5"
    :style="{ '--accent': app.accent }"
  >
    <div class="flex items-center gap-3">
      <AppIcon :app="app" :size="42" />
      <div class="min-w-0">
        <h3 class="font-serif text-[17px] font-bold leading-6 tracking-tight" style="color: var(--ink)">{{ meta.name }}</h3>
        <p class="mt-0.5 line-clamp-2 text-[13px] leading-5" style="color: var(--ink-mute)">{{ meta.tagline }}</p>
      </div>
      <svg class="ml-auto h-4 w-4 flex-none opacity-0 transition-opacity group-hover:opacity-100" style="color: var(--accent)" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 8h11M9.5 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <div class="mt-auto flex items-center gap-2 text-[12px]" style="color: var(--ink-mute)">
      <span class="pill">{{ meta.category }}</span>
      <span>{{ meta.tags }}</span>
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/i18n'
import { useContent } from '@/composables/useContent'
import AppIcon from '@/components/AppIcon.vue'

const props = defineProps({
  app: { type: Object, required: true }
})

const { locale } = useLocale()
const { getAppMeta } = useContent()
const meta = computed(() => getAppMeta(props.app.id, locale.value))

// 开源应用跳转仓库（新窗口），其余进入站内产品页
const cardTag = computed(() => (meta.value.repo ? 'a' : RouterLink))
const cardAttrs = computed(() =>
  meta.value.repo
    ? { href: meta.value.repo, target: '_blank', rel: 'noopener noreferrer' }
    : { to: locale.value === 'en' ? `/en/apps/${props.app.id}` : `/apps/${props.app.id}` }
)
</script>
