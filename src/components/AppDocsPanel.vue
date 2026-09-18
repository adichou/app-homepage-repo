<template>
  <p v-if="docsList.length === 0" class="text-[15px]" style="color: var(--ink-mute)">{{ t('docs.empty') }}</p>
  <div v-else>
    <MarkdownRenderer v-if="doc" :content="doc.content" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useLocale } from '@/i18n'
import { useContent } from '@/composables/useContent'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const props = defineProps({
  app: { type: Object, required: true }
})

const { locale, t } = useLocale()
const { getDocs, getDoc } = useContent()

const docsList = computed(() => getDocs(props.app.id, locale.value))
const activeSlug = ref(docsList.value[0]?.slug || null)
watch(docsList, (list) => {
  if (!list.some((d) => d.slug === activeSlug.value)) activeSlug.value = list[0]?.slug || null
})

const doc = computed(() => (activeSlug.value ? getDoc(props.app.id, activeSlug.value, locale.value) : null))
</script>
