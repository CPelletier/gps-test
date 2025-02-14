import { ref } from 'vue'

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export function usePosts() {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPosts() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`)
      posts.value = await res.json()
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  async function createPost(newPost: Omit<Post, 'id'>): Promise<Post | null> {
    error.value = null
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`)
      const created: Post = await res.json()
      posts.value.unshift(created)
      return created
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Erreur inconnue'
      return null
    }
  }

  async function updatePost(updatedPost: Post): Promise<Post | null> {
    error.value = null
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`)
      const post: Post = await res.json()
      const index = posts.value.findIndex((p) => p.id === post.id)
      if (index !== -1) posts.value[index] = post
      return post
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Erreur inconnue'
      return null
    }
  }

  async function deletePost(id: number): Promise<void> {
    error.value = null
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`)
      posts.value = posts.value.filter((p) => p.id !== id)
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Erreur inconnue'
    }
  }

  return { posts, loading, error, fetchPosts, createPost, updatePost, deletePost }
}
