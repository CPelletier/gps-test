import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/test-technique',
    name: 'Test',
    component: () => import('@/views/TechnicalTestView.vue'),
    children: [
      {
        path: 'exercice-1',
        name: 'Exercise1',
        component: () => import('@/views/Exercise1View.vue'),
        meta: { label: 'Exercice 1', icon: 'pi pi-sparkles' },
      },
      {
        path: 'exercice-2',
        name: 'Exercise2',
        component: () => import('@/views/Exercise2View.vue'),
        meta: { label: 'Exercice 2', icon: 'pi pi-crown' },
      },
      {
        path: 'exercice-3',
        name: 'Exercise3',
        component: () => import('@/views/Exercise3View.vue'),
        meta: { label: 'Exercice 3', icon: 'pi pi-bullseye' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
