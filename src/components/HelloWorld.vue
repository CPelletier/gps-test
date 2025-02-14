<template>
  <div class="hello-world">
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
})
</script>

<style scoped>
.hello-world {
  color: #006a53;
}
</style>
