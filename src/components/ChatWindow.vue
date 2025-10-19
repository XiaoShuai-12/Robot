<template>
  <div class="chat-window">
    <div class="header">
      <div class="title">{{ convTitle }}</div>
      <div class="header-actions">
        <button @click="transferToHuman">转人工</button>
        <span v-if="transferState">{{ transferState }}</span>
      </div>
    </div>
    <div class="messages" ref="msgWrap">
      <div v-if="loadingHistory" class="loading">加载中...</div>
      <MessageList :msgs="msgs" :currentUserId="userId" @retry="retrySend" />
    </div>
    <div class="input-area">
      <MessageInput @send="onSend" />
      <div class="quick-replies">
        <button v-for="q in quicks" :key="q" @click="sendQuick(q)">{{ q }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useChatStore } from '../stores/chat'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import api from '../services/api'

export default {
  name: 'ChatWindow',
  components: { MessageList, MessageInput },
  setup () {
    const store = useChatStore()
    const userId = 'user-1'
    const msgWrap = ref(null)
    const loadingHistory = ref(false)
    const transferState = ref('')
    const quicks = ['如何退款？', '修改地址', '我要发票']
    api.onPush((data) => { store.pushRemoteMessage(data) })
    const currentId = computed(() => store.currentConversationId)
    const msgs = computed(() => (store.messages[currentId.value] || []))
    const convTitle = computed(() => { const conv = store.conversations.find(c => c.id === currentId.value); return conv ? conv.title : '未选择会话' })
    onMounted(() => { store.restoreCache() })
    watch(msgs, async () => { await nextTick(); if (msgWrap.value) msgWrap.value.scrollTop = msgWrap.value.scrollHeight })
    const onSend = async (content) => { if (!currentId.value) { const id = 'conv-' + Date.now(); store.conversations.unshift({ id, title: '新会话', lastMessage: '', unread: 0, updatedAt: new Date().toISOString() }); await store.selectConversation(id) } try { await store.sendMessage(store.currentConversationId, content) } catch (e) { console.error('Send failed', e) } }
    const sendQuick = (q) => { onSend(q) }
    const transferToHuman = async () => { transferState.value = '正在请求转人工...'; try { api.wsSend({ action: 'transfer', conversationId: store.currentConversationId }); setTimeout(() => { transferState.value = '排队第1位，预计等待3分钟' }, 800) } catch (e) { transferState.value = '转接失败，请重试' } }
    const retrySend = async (message) => { try { message.status = 'sending'; await store.sendMessage(message.conversationId, message.content, message.meta) } catch (e) { message.status = 'failed' } }
    return { userId, msgWrap, msgs, convTitle, onSend, quicks, sendQuick, loadingHistory, transferToHuman, transferState, retrySend }
  }
}
</script>