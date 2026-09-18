import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import PortalHome from './views/PortalHome.vue'
import AppHome from './views/AppHome.vue'
import DocsPage from './views/DocsPage.vue'
import FaqPage from './views/FaqPage.vue'
import ChangelogPage from './views/ChangelogPage.vue'
import LegalPage from './views/LegalPage.vue'
import SupportPage from './views/SupportPage.vue'
import NotFound from './views/NotFound.vue'
import { getApp } from './data/apps'
import './style.css'

// 中文为默认语言（无前缀），英文镜像到 /en/ 前缀下
const routeDefs = [
  { path: '/', name: 'portal', component: PortalHome },
  { path: '/apps/:app', name: 'app-home', component: AppHome },
  { path: '/apps/:app/docs', name: 'app-docs-index', component: DocsPage },
  { path: '/apps/:app/docs/:slug', name: 'app-docs', component: DocsPage },
  { path: '/apps/:app/faq', name: 'app-faq', component: FaqPage },
  { path: '/apps/:app/changelog', name: 'app-changelog', component: ChangelogPage },
  { path: '/apps/:app/privacy', name: 'app-privacy', component: LegalPage, meta: { legal: 'privacy' } },
  { path: '/support', name: 'support', component: SupportPage },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]

const routes = [
  ...routeDefs.map((def) => ({ ...def, meta: { ...def.meta, locale: 'zh' } })),
  ...routeDefs.map((def) => ({
    ...def,
    path: `/en${def.path === '/' ? '' : def.path}`,
    name: `${def.name}-en`,
    meta: { ...def.meta, locale: 'en' }
  }))
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 80 }
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  // 校验 :app 参数是否在注册表中
  if (to.params.app !== undefined && !getApp(to.params.app)) {
    return { name: `not-found${to.meta.locale === 'en' ? '-en' : ''}` }
  }

  // 首次访问且从未手动切换过语言时，按浏览器语言跳转 /en 镜像（每会话最多一次，防止循环）
  try {
    if (
      to.meta.locale === 'zh' &&
      !localStorage.getItem('ah:lang') &&
      !sessionStorage.getItem('ah:lang-auto')
    ) {
      sessionStorage.setItem('ah:lang-auto', '1')
      const preferred = (navigator.languages && navigator.languages[0]) || navigator.language || ''
      if (String(preferred).toLowerCase().startsWith('en')) {
        return { path: `/en${to.path === '/' ? '' : to.path}` }
      }
    }
  } catch (e) {
    /* 私密模式下存储不可用则跳过自动重定向 */
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
