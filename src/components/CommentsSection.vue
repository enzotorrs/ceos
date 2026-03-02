<template>
  <div class="comments-section">
    <h3 class="comments-title">{{ comments.length }} Comments</h3>

    <div class="comment-input-row">
      <v-avatar size="36" class="comment-avatar">
        <v-img v-if="authStore.me?.avatarUrl" :src="authStore.me.avatarUrl" />
        <v-icon v-else :icon="mdiAccount" size="20" color="white" />
      </v-avatar>
      <div class="comment-input-wrap">
        <v-textarea
          v-model="newComment"
          placeholder="Add a comment..."
          variant="plain"
          density="compact"
          rows="1"
          auto-grow
          hide-details
          class="comment-textarea"
          @keydown.enter.ctrl.prevent="submit"
        />
        <div class="comment-actions">
          <v-btn variant="text" size="small" @click="newComment = ''">Cancel</v-btn>
          <v-btn
            variant="tonal"
            color="primary"
            size="small"
            :disabled="!newComment.trim() || submitting"
            :loading="submitting"
            @click="submit"
          >
            Comment
          </v-btn>
        </div>
      </div>
    </div>

    <div v-if="loading" class="comments-loading">
      <v-progress-circular indeterminate size="24" color="primary" />
    </div>

    <div v-else class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <v-avatar size="36" class="comment-avatar">
          <v-img v-if="comment.user.avatarFilename" :src="avatarUrls[comment.user.avatarFilename] ?? ''" />
          <v-icon v-else :icon="mdiAccount" size="20" color="white" />
        </v-avatar>
        <div class="comment-body">
          <div class="comment-meta">
            <span class="comment-author">{{ comment.user.username }}</span>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
        <v-btn
          v-if="canDelete(comment)"
          :icon="mdiDelete"
          variant="text"
          size="x-small"
          color="grey"
          class="comment-delete"
          @click="handleDelete(comment.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { mdiAccount, mdiDelete } from '@mdi/js'
import { useAuthStore } from '@/stores/auth'
import { useComments } from '@/composables/useComments'
import { apiClient } from '@/services/apiClient'
import type { Comment } from '@/Asset'

const props = defineProps<{
  assetId: number
  assetOwnerUsername: string
}>()

const authStore = useAuthStore()
const { comments, loading, load, add, remove } = useComments()

const newComment = ref('')
const submitting = ref(false)
const avatarUrls = ref<Record<string, string>>({})

onMounted(() => load(props.assetId))

watch(comments, async (list) => {
  for (const c of list) {
    if (c.user.avatarFilename && !avatarUrls.value[c.user.avatarFilename]) {
      const { data } = await apiClient.get(`/media/${c.user.avatarFilename}`)
      avatarUrls.value[c.user.avatarFilename] = data.data
    }
  }
})

async function submit() {
  const content = newComment.value.trim()
  if (!content || submitting.value) return
  submitting.value = true
  await add(props.assetId, content)
  newComment.value = ''
  submitting.value = false
}

async function handleDelete(commentId: number) {
  await remove(commentId)
}

function canDelete(comment: Comment) {
  const username = authStore.me?.username
  if (!username) return false
  return comment.user.username === username || props.assetOwnerUsername === username
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(iso)
  )
}
</script>

<style scoped>
.comments-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comments-title {
  color: #f1f1f1;
  font-size: 1rem;
  font-weight: 600;
}

.comment-input-row,
.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  background-color: #3f3f3f;
  flex-shrink: 0;
}

.comment-input-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #3f3f3f;
}

.comment-textarea {
  color: #f1f1f1;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 6px 0;
}

.comments-loading {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-body {
  flex: 1;
}

.comment-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  color: #f1f1f1;
  font-size: 0.875rem;
  font-weight: 500;
}

.comment-date {
  color: #aaa;
  font-size: 0.75rem;
}

.comment-content {
  color: #d0d0d0;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0;
}

.comment-delete {
  align-self: flex-start;
  opacity: 0.5;
}

.comment-delete:hover {
  opacity: 1;
}
</style>
