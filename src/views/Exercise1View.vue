<template>
  <TextEditor v-model="text" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextEditor from '@/components/TextEditor.vue'

const text = ref('Center me')
</script>

<style lang="scss" scoped>
.app__center-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20vw;
  gap: 1rem 0;
  padding: 2rem;
  aspect-ratio: 1;
  background: yellow;
}
</style>
