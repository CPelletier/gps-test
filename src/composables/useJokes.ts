import { ref } from 'vue'
import rateLimiter from '@/utils/RateLimiter'

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await rateLimiter.schedule(() => fetch(url))
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`)
      }
      data.value = await response.json()
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
      } else {
        error.value = 'Erreur inconnue'
      }
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, fetchData }
}
