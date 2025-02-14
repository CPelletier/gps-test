<template>
  <div class="wrapper">
    <img alt="G2S Logo" :src="logo" width="150" />
    <HelloWorld msg="Test technique G2S" />
    <p>Voici mon test technique, à bientôt peut-être.</p>
    <p>Charles Pelletier, développeur front-end</p>
    <Button as="router-link" label="Router" to="/test-technique/exercice-1"
      >Regarder le test</Button
    >
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import HelloWorld from '@/components/HelloWorld.vue'
import logo from '@/assets/G2S-logo.jpg'
</script>

<style lang="css" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 1rem;
}
</style>
