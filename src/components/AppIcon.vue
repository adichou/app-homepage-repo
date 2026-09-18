<template>
  <!-- 图标取自 content/<app>/<locale>/image/icon.*，无图标时回退字母块 -->
  <img v-if="src" class="app-icon" :src="src" :style="imgStyle" alt="" aria-hidden="true" />
  <div v-else class="app-icon" :style="letterStyle" aria-hidden="true">{{ fallbackLetter }}</div>
</template>

<script setup>
import { computed } from 'vue'
import { useContent } from '@/composables/useContent'

const props = defineProps({
  app: { type: Object, required: true },
  size: { type: Number, default: 56 }
})

const { getIconUrl } = useContent()
const src = computed(() => getIconUrl(props.app.id))
const fallbackLetter = computed(() => props.app.id.charAt(0).toUpperCase())

const imgStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: `${Math.round(props.size * 0.24)}px`
}))

const letterStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  fontSize: `${Math.round(props.size * 0.46)}px`,
  borderRadius: `${Math.round(props.size * 0.24)}px`,
  background: `linear-gradient(145deg, ${props.app.accent}, color-mix(in srgb, ${props.app.accent} 60%, #fff))`
}))
</script>

<style scoped>
.app-icon {
  display: grid;
  place-items: center;
  flex: none;
  object-fit: cover;
  color: #fff;
  font-family: theme('fontFamily.serif');
  font-weight: 700;
  line-height: 1;
  box-shadow: var(--shadow);
}
</style>
