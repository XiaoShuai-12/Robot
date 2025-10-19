import { createRouter, createWebHistory } from 'vue-router'
import ChatPage from '../views/ChatPage.vue'
import FAQPage from '../views/FAQPage.vue'

const routes = [
  { path: '/', name: 'Chat', component: ChatPage },
  { path: '/faq', name: 'FAQ', component: FAQPage }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router