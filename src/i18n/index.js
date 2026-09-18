import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { messages } from './messages'

const LANG_KEY = 'ah:lang'

// 当前语言（单例状态），初始值由路由 meta.locale 在 App.vue 中同步
const locale = ref('zh')

function resolveKey(obj, key) {
  return key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), obj)
}

export function useLocale() {
  const router = useRouter()

  const t = computed(() => (key) => {
    const value = resolveKey(messages[locale.value], key)
    if (value !== undefined) return value
    // 回落到另一语言，避免缺词条直接裸露 key
    const fallback = resolveKey(messages[locale.value === 'zh' ? 'en' : 'zh'], key)
    return fallback !== undefined ? fallback : key
  })

  const otherLocale = computed(() => (locale.value === 'zh' ? 'en' : 'zh'))

  function setLocale(next) {
    locale.value = next
    document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN'
  }

  // 手动切换：记住选择，并跳到当前页面的另一语言镜像路由
  function switchLocale() {
    const next = otherLocale.value
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch (e) {}
    setLocale(next)

    const path = router.currentRoute.value.path
    const mirror =
      next === 'en' ? `/en${path === '/' ? '' : path}` : path.replace(/^\/en(?=\/|$)/, '') || '/'
    router.push(mirror)
  }

  return { locale, otherLocale, t, setLocale, switchLocale }
}
