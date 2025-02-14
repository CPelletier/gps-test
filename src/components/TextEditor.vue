<template>
  <div class="wrapper">
    <div class="app__center-wrapper">
      <span @click="startEditing" class="editable-text__display">
        {{ localValue }}
      </span>
    </div>
    <TextArea
      v-model="localValue"
      @blur="stopEditing"
      @keyup.enter="stopEditing"
      ref="inputRef"
      class="editable-text__input"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, defineProps, defineEmits } from 'vue'
import TextArea from 'primevue/textarea'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal
  },
)

const isEditing = ref(false)

const inputRef = ref<HTMLInputElement | null>(null)

const startEditing = () => {
  isEditing.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const stopEditing = () => {
  isEditing.value = false
  emit('update:modelValue', localValue.value)
}
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
}
.app__center-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 80vw;
  gap: 1rem;
  padding: 2rem;
  aspect-ratio: 1;
  background: yellow;

  @media screen and (min-width: 768px) {
    width: 20vw;
  }
}

.editable-text {
  &__input {
    width: 100%;
  }

  &__display {
    display: inline-flex;
    min-height: 2.2rem;
    padding: 0.5rem 1rem;
    background: green;
    color: #fff;
    line-height: 1.2;
    word-break: break-word;
  }
}
</style>
