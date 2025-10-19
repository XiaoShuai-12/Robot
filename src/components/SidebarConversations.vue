<template>
  <div class="sidebar-conversations">
    <div class="header">会话</div>
    <ul class="list">
      <li v-for="conv in conversations" :key="conv.id" :class="{active: conv.id === current}" @click="open(conv.id)">
        <div class="meta">
          <div class="title">{{ conv.title }}</div>
          <div class="preview">{{ conv.lastMessage }}</div>
        </div>
        <div class="side">
          <div class="time">{{ formatTime(conv.updatedAt) }}</div>
          <div class="unread" v-if="conv.unread"> {{ conv.unread }} </div>
        </div>
        <div class="actions">
          <button @click.stop="pin(conv.id)">置顶</button>
          <button @click.stop="remove(conv.id)">删除</button>
        </div>
      </li>
    </ul>
    <div class="new-chat"><button @click="newConversation">+ 新会话</button></div>
  </div>
</template>

<script>
import { useChatStore } from '../stores/chat'
import { computed } from 'vue'
export default {
  name: 'SidebarConversations',
  setup () {
    const store = useChatStore()
    const conversations = computed(() => store.conversations)
    const current = computed(() => store.currentConversationId)
    const open = (id) => { store.selectConversation(id) }
    const remove = (id) => { store.conversations = store.conversations.filter(c => c.id !== id); store.persistCache() }
    const pin = (id) => { const idx = store.conversations.findIndex(c => c.id === id); if (idx !== -1) { const item = store.conversations.splice(idx, 1)[0]; store.conversations.unshift(item); store.persistCache() } }
    const newConversation = () => { const id = 'conv-' + Date.now(); const item = { id, title: '新会话', lastMessage: '', unread: 0, updatedAt: new Date().toISOString() }; store.conversations.unshift(item); store.selectConversation(id); store.persistCache() }
    const formatTime = (iso) => { if (!iso) return ''; const d = new Date(iso); return d.toLocaleTimeString() }
    return { conversations, current, open, remove, pin, newConversation, formatTime }
  }
}
</script>