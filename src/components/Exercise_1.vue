<template>
  <TextEditor v-model="text" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextEditor from '@/components/TextEditor.vue'

const text = ref('Center me')
</script>
