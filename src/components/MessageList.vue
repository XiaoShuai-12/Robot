<template>
  <div class="message-list">
    <div v-for="m in msgs" :key="m.id" class="msg-row" :class="{'from-user': m.from === 'user', 'from-bot': m.from !== 'user'}">
      <div class="bubble">
        <div class="content" v-html="renderContent(m.content)"></div>
        <div class="meta">
          <span class="time">{{ formatTime(m.createdAt) }}</span>
          <span class="status" v-if="m.from === 'user'">
            <template v-if="m.status === 'sending'">发送中...</template>
            <template v-else-if="m.status === 'failed'"><button @click="$emit('retry', m)">重试</button></template>
            <template v-else>已发送</template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageList',
  props: { msgs: { type: Array, default: () => [] }, currentUserId: { type: String, default: '' } },
  methods: { renderContent(content) { return content }, formatTime(iso) { if (!iso) return ''; const d = new Date(iso); return d.toLocaleString() }
}
}
</script>