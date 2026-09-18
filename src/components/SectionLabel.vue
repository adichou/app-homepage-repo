<template>
  <div class="eyebrow">
    <span class="num">{{ num }}</span>
    <span>{{ label }}</span>
    <span class="rule" aria-hidden="true"></span>
  </div>
</template>

<script setup>
defineProps({
  num: { type: String, required: true },
  label: { type: String, required: true }
})
</script>
