<template>
  <Button @click="handleClick" :disabled="processing && !canReload"> Charger une blague </Button>
  <Dialog
    v-model:visible="showDialog"
    :header="dialogHeader"
    modal
    position="top"
    closable
    :style="{ width: '50vw' }"
    :breakpoints="{ '767px': '90vw' }"
    class="g2s-dialog"
    @hide="onDialogHide"
  >
    <div>
      <pre>{{ jokeText }}</pre>
      <div v-if="processing" class="timer">
        Réponse dans : {{ timer }} seconde<span v-if="timer > 1">s</span>
      </div>
    </div>
  </Dialog>

  <div v-if="error" class="error">
    {{ error }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/composables/useJokes'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

interface Joke {
  error: boolean
  category: string
  type: 'single' | 'twopart'
  joke?: string
  setup?: string
  delivery?: string
  flags: {
    nsfw: boolean
    religious: boolean
    political: boolean
    racist: boolean
    sexist: boolean
    explicit: boolean
  }
  safe: boolean
  id: number
  lang: string
}

const processing = ref(false)
const timer = ref<number>(5)
const showDialog = ref(false)
const jokeText = ref<string>('')
const dialogHeader = ref<string>('Blague')
const canReload = ref(true)
let countdownInterval: number | null = null

const { data, error, fetchData } = useFetch<Joke>(
  'https://v2.jokeapi.dev/joke/Any?lang=fr&blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart',
)

const handleClick = async () => {
  processing.value = true
  timer.value = 5
  showDialog.value = false
  jokeText.value = ''

  await fetchData()

  if (data.value) {
    dialogHeader.value = data.value.category
    jokeText.value = data.value.setup || ''
    showDialog.value = true

    countdownInterval = setInterval(() => {
      timer.value--
      if (timer.value <= 0) {
        clearInterval(countdownInterval!)
        countdownInterval = null
        jokeText.value += '\n\n' + (data.value?.delivery || '')
        processing.value = false
        canReload.value = true
      }
    }, 1000)
  } else {
    processing.value = false
    canReload.value = true
  }
}

const onDialogHide = () => {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  processing.value = false
  timer.value = 5
  jokeText.value = ''
  canReload.value = true
}
</script>

<style lang="css" scoped>
.error {
  color: red;
}
pre {
  white-space: pre-wrap;
}
</style>
