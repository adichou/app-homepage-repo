import { computed, watchEffect } from 'vue'
import { useLocalStorage, usePreferredDark } from '@vueuse/core'

// 三态主题：auto（跟随系统）→ light → dark，选择持久化到 localStorage。
// index.html 中的内联脚本会在首帧前应用一次，避免闪烁。
const THEME_KEY = 'ah:theme'

const preference = useLocalStorage(THEME_KEY, 'auto')
const systemDark = usePreferredDark()

const isDark = computed(() =>
  preference.value === 'auto' ? systemDark.value : preference.value === 'dark'
)

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})

export function useTheme() {
  const order = ['auto', 'light', 'dark']

  function cycle() {
    const next = order[(order.indexOf(preference.value) + 1) % order.length]
    preference.value = next
  }

  return { preference, isDark, cycle }
}
