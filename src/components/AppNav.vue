<template>
  <nav :aria-label="label">
    <!-- 移动端：横向滚动页签 -->
    <div class="subnav-mobile scrollbar-hide -mx-5 flex gap-6 overflow-x-auto px-5 py-2 lg:hidden">
      <button
        v-for="item in items"
        :key="item"
        type="button"
        class="subnav-tab whitespace-nowrap text-[13.5px]"
        :class="{ active: item === modelValue }"
        @click="select(item)"
      >
        {{ t(`app.nav.${item}`) }}
      </button>
    </div>

    <!-- 桌面端：左侧竖排页签（吸顶） -->
    <div class="hidden lg:block">
      <div class="sticky top-20 flex flex-col gap-1">
        <button
          v-for="item in items"
          :key="item"
          type="button"
          class="subnav-link block w-full rounded-md px-3 py-2 text-left text-[13.5px] leading-6 transition-colors"
          :class="{ active: item === modelValue }"
          @click="select(item)"
        >
          {{ t(`app.nav.${item}`) }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '@/i18n'
import { useContent } from '@/composables/useContent'

const props = defineProps({
  app: { type: Object, required: true },
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])
const { locale, t } = useLocale()
const { getAppMeta } = useContent()
const label = computed(() => getAppMeta(props.app.id, locale.value).name)

const items = ['docs', 'features', 'changelog', 'faq']

function select(key) {
  emit('update:modelValue', key)
}
</script>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.subnav-mobile {
  border-bottom: 1px solid var(--line);
}

.subnav-tab {
  padding: 0.25rem 0;
  color: var(--ink-soft);
  transition: color 0.15s;
}
.subnav-tab:hover {
  color: var(--ink);
}
.subnav-tab.active {
  color: var(--accent);
  font-weight: 600;
}

.subnav-link {
  color: var(--ink-soft);
}
.subnav-link:hover {
  color: var(--accent);
}
.subnav-link.active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
}
</style>
