<template>
  <Splitter class="g2s-split" :layout="splitterOrientation">
    <SplitterPanel class="g2s-split-panel" style="overflow-y: scroll">
      <h2>{{ isEditing ? 'Modifier le post' : 'Créer un nouveau post' }}</h2>
      <form @submit.prevent="isEditing ? handleUpdate() : handleCreate()">
        <div class="p-field">
          <label for="title">Titre :</label>
          <InputText id="title" v-model="form.title" required />
        </div>
        <div class="p-field">
          <label for="body">Contenu :</label>
          <TextArea id="body" v-model="form.body" rows="5" required />
        </div>
        <div class="p-field">
          <label for="userId">User ID :</label>
          <InputText id="userId" v-model="form.userId" type="number" required />
        </div>
        <div class="p-field">
          <Button type="submit" :label="isEditing ? 'Mettre à jour' : 'Créer'" />
          <Button v-if="isEditing" label="Annuler" class="p-button-secondary" @click="cancelEdit" />
        </div>
      </form>
    </SplitterPanel>
    <SplitterPanel class="g2s-split-panel" style="overflow-y: scroll">
      <h1>Liste des posts</h1>
      <div v-if="loading">Chargement des posts...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <Accordion v-if="!loading && !error">
        <AccordionTab v-for="post in paginatedPosts" :key="post.id" :header="post.title">
          <p>{{ post.body }}</p>
          <div class="actions">
            <Button
              label="Modifier"
              icon="pi pi-pencil"
              class="p-button-sm"
              @click="startEdit(post)"
            />
            <Button
              label="Supprimer"
              icon="pi pi-trash"
              class="p-button-sm p-button-danger"
              @click="deletePostHandler(post.id)"
            />
          </div>
        </AccordionTab>
      </Accordion>
      <Paginator
        :first="first"
        :rows="rows"
        :totalRecords="posts.length"
        @page="onPageChange"
        class="paginator"
      />
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Accordion from 'primevue/accordion'
import Paginator from 'primevue/paginator'
import AccordionTab from 'primevue/accordiontab'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import TextArea from 'primevue/textarea'
import { usePosts } from '@/composables/usePosts'

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

interface PageState {
  first: number
  rows: number
  page: number
  pageCount?: number
}

const { posts, loading, error, fetchPosts, createPost, updatePost, deletePost } = usePosts()

onMounted(() => {
  fetchPosts()
  window.addEventListener('resize', updateWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth)
})

const form = ref({
  title: '',
  body: '',
  userId: '',
})
const isEditing = ref(false)
const editingPostId = ref<number | null>(null)

const startEdit = (post: Post) => {
  isEditing.value = true
  editingPostId.value = post.id
  form.value.title = post.title
  form.value.body = post.body
  form.value.userId = post.userId.toString()
}

const cancelEdit = () => {
  isEditing.value = false
  editingPostId.value = null
  form.value.title = ''
  form.value.body = ''
  form.value.userId = ''
}

const handleCreate = async () => {
  const newPostData = {
    title: form.value.title,
    body: form.value.body,
    userId: Number(form.value.userId),
  }
  await createPost(newPostData)
  form.value.title = ''
  form.value.body = ''
  form.value.userId = ''
}

const handleUpdate = async () => {
  if (editingPostId.value === null) return
  const updatedData: Post = {
    id: editingPostId.value,
    title: form.value.title,
    body: form.value.body,
    userId: Number(form.value.userId),
  }
  await updatePost(updatedData)
  cancelEdit()
}

const deletePostHandler = async (id: number) => {
  await deletePost(id)
}

const first = ref(0)
const rows = ref(10)

const paginatedPosts = computed(() => {
  return posts.value.slice(first.value, first.value + rows.value)
})

const onPageChange = (event: PageState) => {
  first.value = event.first
  rows.value = event.rows
}

const screenWidth = ref(window.innerWidth)
const updateWidth = () => {
  screenWidth.value = window.innerWidth
}

const splitterOrientation = computed(() => {
  return screenWidth.value < 768 ? 'vertical' : 'horizontal'
})
</script>

<style lang="scss">
.error {
  color: red;
}
.g2s-split {
  height: 100%;

  @media screen and (min-width: 768px) {
    height: 500px;
  }
}
.g2s-split-panel {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.p-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
</style>
