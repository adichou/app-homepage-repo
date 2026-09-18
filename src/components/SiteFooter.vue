<template>
  <footer style="border-top: 1px solid var(--line)">
    <div class="shell py-8">
      <p class="text-[13px]" style="color: var(--ink-mute)">
        {{ t('footer.rights') }}
      </p>
    </div>
  </footer>
</template>

<script setup>
import { useLocale } from '@/i18n'

const { t } = useLocale()
</script>
