<script setup>
import { computed, ref, watch } from 'vue'
import { useLocale } from '@/i18n'
import { useContent } from '@/composables/useContent'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const props = defineProps({
  app: { type: Object, required: true }
})

const { locale, t } = useLocale()
const { getDoc } = useContent()

// 功能介绍存放于 docs/features.<locale>.md
const doc = computed(() => getDoc(props.app.id, 'features', locale.value))
const activeSlug = ref('features')
watch(
  () => props.app.id,
  () => {
    activeSlug.value = 'features'
  }
)
</script>

<template>
  <p v-if="!doc" class="text-[15px]" style="color: var(--ink-mute)">{{ t('docs.empty') }}</p>
  <MarkdownRenderer v-else :content="doc.content" />
</template>
