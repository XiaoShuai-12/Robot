<template>
  <div class="app-root" :class="theme">
    <header class="topbar">
      <div class="logo">智能客服</div>
      <div class="controls">
        <label>
          <input type="checkbox" v-model="isDark" />
          暗色
        </label>
        <select v-model="fontSize">
          <option value="small">小</option>
          <option value="medium">中</option>
          <option value="large">大</option>
        </select>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
export default {
  setup () {
    const isDark = ref(false)
    const fontSize = ref('medium')
    if (localStorage.getItem('chat_theme') === 'dark') isDark.value = true
    const savedFont = localStorage.getItem('chat_font_size')
    if (savedFont) fontSize.value = savedFont
    watch(isDark, val => { localStorage.setItem('chat_theme', val ? 'dark' : 'light') })
    watch(fontSize, val => { localStorage.setItem('chat_font_size', val) })
    const theme = computed(() => (isDark.value ? 'theme-dark' : 'theme-light'))
    return { isDark, fontSize, theme }
  }
}
</script>

<style>
.app-root { display:flex; flex-direction:column; height:100vh; }
.topbar { display:flex; justify-content:space-between; align-items:center; padding:8px 16px; background:#f5f5f5; }
.main { flex:1; display:flex; }
.theme-dark .topbar { background:#2b2b2b; color:#fff; }
.theme-dark { background:#121212; color:#eaeaea; }
</style>