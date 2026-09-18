<template>
  <div class="shell animate-fade-in pb-16">
    <div class="mx-auto w-full max-w-3xl">
      <!-- 联系方式 -->
      <header class="pt-12">
        <p class="text-[15px] leading-8" style="color: var(--ink-soft)">{{ t('support.intro') }}</p>

        <div class="mt-8 grid gap-5 sm:grid-cols-2">
          <!-- 微信公众号（仅中文：横版二维码物料） -->
          <div v-if="locale === 'zh'" class="card-editorial overflow-hidden">
            <img
              :src="wechatQrUrl"
              alt="微信公众号二维码"
              class="w-full"
              loading="lazy"
            />
          </div>

          <!-- X（仅英文） -->
          <a
            v-else
            :href="X_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="card-editorial flex items-center gap-4 p-6 transition-transform hover:-translate-y-0.5"
          >
            <div>
              <p class="text-[15px] font-semibold" style="color: var(--ink)">{{ t('support.contactX') }}</p>
              <p class="mt-1 text-[13.5px]" style="color: var(--accent)">{{ t('support.xHandle') }}</p>
            </div>
          </a>

          <!-- 邮箱 -->
          <a
            href="mailto:adichou501@126.com"
            class="card-editorial flex items-center gap-4 p-6 transition-transform hover:-translate-y-0.5"
          >
            <div>
              <p class="text-[15px] font-semibold" style="color: var(--ink)">{{ t('support.contactEmail') }}</p>
              <p class="mt-1 text-[13.5px]" style="color: var(--accent)">{{ t('support.email') }}</p>
            </div>
          </a>
        </div>
      </header>
    </div>
  </div>
</template>

<script setup>
import { useLocale } from '@/i18n'
import { usePageMeta } from '@/composables/usePageMeta'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
const wechatQrUrl = `${BASE}/wechat-qrcode.jpg`
const X_URL = 'https://x.com/adi__chou'

const { locale, t } = useLocale()

usePageMeta(
  () => `${t.value('support.title')} · ${t.value('site.name')}`,
  () => t.value('site.description')
)
</script>
