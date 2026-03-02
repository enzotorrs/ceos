import { ref } from 'vue'
import { apiClient } from '@/services/apiClient'
import { useToastStore } from '@/stores/toast'
import type { Comment } from '@/Asset'

export function useComments() {
  const toast = useToastStore()
  const comments = ref<Comment[]>([])
  const loading = ref(false)

  async function load(assetId: number) {
    loading.value = true
    try {
      const { data } = await apiClient.get('/comment', { params: { assetId } })
      comments.value = data.data
    } catch {
      toast.error('Failed to load comments')
    } finally {
      loading.value = false
    }
  }

  async function add(assetId: number, content: string) {
    try {
      const { data } = await apiClient.post('/comment', { assetId, content })
      comments.value.push(data.data)
    } catch {
      toast.error('Failed to post comment')
    }
  }

  async function remove(commentId: number) {
    try {
      await apiClient.delete(`/comment/${commentId}`)
      const index = comments.value.findIndex((c) => c.id === commentId)
      if (index !== -1) comments.value.splice(index, 1)
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  return { comments, loading, load, add, remove }
}
