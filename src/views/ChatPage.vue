<template>
  <div class="chat-page">
    <aside class="sidebar">
      <SidebarConversations />
      <div class="faq-link"><router-link to="/faq">常见问题</router-link></div>
    </aside>
    <section class="chat-main">
      <ChatWindow />
    </section>
  </div>
</template>

<script>
import SidebarConversations from '../components/SidebarConversations.vue'
import ChatWindow from '../components/ChatWindow.vue'
export default { components: { SidebarConversations, ChatWindow } }
</script>