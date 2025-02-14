<template>
  <Tabs :value="currentTab" class="g2s-tabs">
    <TabList>
      <Tab v-for="tab in tabs" :key="tab.path" :value="tabFullPath(tab)" class="g2s-tabs__tab-btn">
        <router-link :to="tabFullPath(tab)" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate" class="g2s-tabs__tab-link">
            <i :class="tab.meta?.icon" />
            <span>{{ tab.meta?.label }}</span>
          </a>
        </router-link>
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel v-for="tab in tabs" :key="tab.path" :value="tabFullPath(tab)">
        <router-view />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import 'primeicons/primeicons.css'

type PrimeTabRoute = RouteRecordRaw & {
  meta: {
    icon: string
    label: string
    [key: string]: unknown
  }
}

function isPrimeTab(route: RouteRecordRaw): route is PrimeTabRoute {
  const meta = route.meta as Record<string, unknown> | undefined
  return (
    meta !== undefined &&
    typeof meta === 'object' &&
    'icon' in meta &&
    'label' in meta &&
    typeof meta.icon === 'string' &&
    typeof meta.label === 'string'
  )
}

const route = useRoute()
const router = useRouter()

const testRoute = computed(() => {
  return router.getRoutes().find((r) => r.name === 'Test')
})

const tabs = computed<PrimeTabRoute[]>(() => {
  return testRoute.value?.children?.filter(isPrimeTab) || []
})

const tabFullPath = (tab: PrimeTabRoute): string => `/test-technique/${tab.path}`

const currentTab = computed(() => {
  return route.fullPath
})
</script>

<style lang="scss" scoped>
.g2s-tabs {
  width: 100%;
  height: 80%;

  @media screen and (min-width: 768px) {
    width: 80%;
  }

  &__tab-btn {
    padding: 0;
  }

  &__tab-link {
    display: flex;
    height: 100%;
    width: 100%;
    gap: 0 1rem;
    padding: var(--p-tabs-tab-padding);
    color: inherit;
    text-decoration: none;
  }
}
</style>
