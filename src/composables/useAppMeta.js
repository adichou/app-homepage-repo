import { computed } from 'vue'
import { useLocale } from '@/i18n'
import { useContent } from '@/composables/useContent'

const EMPTY = { name: '', tagline: '', category: '', platforms: '' }

// 读取 app 在当前语言的元信息（content/<locale>/index.md frontmatter）
export function useAppMeta(app) {
  const { locale } = useLocale()
  const { getAppMeta } = useContent()
  return computed(() => (app.value ? getAppMeta(app.value.id, locale.value) : EMPTY))
}
