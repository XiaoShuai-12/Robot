import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '../services/api'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref([])
  const currentConversationId = ref(null)
  const messages = reactive({})
  const loadingHistory = ref(false)
  const settings = reactive({ notifications: true, sound: true })

  const restoreCache = () => {
    try {
      const cached = JSON.parse(localStorage.getItem('chat_cache'))
      if (cached) {
        if (cached.conversations) conversations.value = cached.conversations
        if (cached.messages) Object.assign(messages, cached.messages)
      }
    } catch (e) {}
  }

  const persistCache = () => {
    const payload = { conversations: conversations.value, messages }
    localStorage.setItem('chat_cache', JSON.stringify(payload))
  }

  const selectConversation = async (conversationId) => {
    currentConversationId.value = conversationId
    if (!messages[conversationId] || messages[conversationId].length === 0) {
      loadingHistory.value = true
      const history = await api.fetchHistory(conversationId, { limit: 20 })
      messages[conversationId] = history || []
      loadingHistory.value = false
      persistCache()
    }
  }

  const sendMessage = async (conversationId, content, meta = {}) => {
    const msg = { id: 'temp-' + Date.now(), conversationId, from: 'user', content, status: 'sending', createdAt: new Date().toISOString(), meta }
    messages[conversationId] = messages[conversationId] || []
    messages[conversationId].push(msg)
    persistCache()
    try {
      const resp = await api.sendMessage(conversationId, content, meta)
      Object.assign(msg, { id: resp.id, status: 'sent', createdAt: resp.createdAt || msg.createdAt })
      persistCache()
      return msg
    } catch (err) {
      msg.status = 'failed'
      persistCache()
      throw err
    }
  }

  const recallMessage = async (conversationId, messageId) => {
    try {
      await api.recallMessage(conversationId, messageId)
      const arr = messages[conversationId] || []
      const idx = arr.findIndex(m => m.id === messageId)
      if (idx !== -1) arr.splice(idx, 1)
      persistCache()
    } catch (e) { throw e }
  }

  const pushRemoteMessage = (remoteMsg) => {
    const cid = remoteMsg.conversationId
    messages[cid] = messages[cid] || []
    messages[cid].push(remoteMsg)
    let conv = conversations.value.find(c => c.id === cid)
    if (!conv) {
      conv = { id: cid, title: remoteMsg.fromName || '对话', unread: 0, lastMessage: remoteMsg.content, updatedAt: new Date().toISOString() }
      conversations.value.unshift(conv)
    } else {
      conv.lastMessage = remoteMsg.content
      conv.updatedAt = new Date().toISOString()
      if (currentConversationId.value !== cid) conv.unread = (conv.unread || 0) + 1
    }
    persistCache()
  }

  return { conversations, currentConversationId, messages, settings, loadingHistory, restoreCache, persistCache, selectConversation, sendMessage, recallMessage, pushRemoteMessage }
})