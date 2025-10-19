<template>
  <div class="message-input">
    <textarea ref="textarea" v-model="text" @keydown.enter.prevent="onEnter" @keydown.shift.enter.stop placeholder="输入消息，回车发送，Shift+回车换行" :maxlength="maxLen"></textarea>
    <div class="controls">
      <div class="left">
        <button @click="openEmoji">😊</button>
        <input type="file" ref="file" @change="onFile" style="display:none" />
        <button @click="pickFile">图片</button>
      </div>
      <div class="right">
        <button @click="doSend" :disabled="sending || !canSend">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
export default {
  name: 'MessageInput',
  emits: ['send'],
  setup (_, { emit }) {
    const text = ref('')
    const maxLen = 500
    const sending = ref(false)
    const textarea = ref(null)
    const canSend = computed(() => text.value.trim().length > 0)
    const onEnter = (ev) => { if (ev.shiftKey) { text.value += '\n'; return } doSend() }
    const doSend = async () => { if (!canSend.value || sending.value) return; sending.value = true; try { await emit('send', text.value); text.value = '' } catch (e) { console.error('send error', e) } finally { sending.value = false } }
    const openEmoji = () => { text.value += '😊' }
    const pickFile = () => { file.value.click() }
    const onFile = (e) => { const f = e.target.files[0]; if (!f) return; const reader = new FileReader(); reader.onload = () => { emit('send', `[图片](${f.name})`) }; reader.readAsDataURL(f) }
    return { text, maxLen, onEnter, doSend, sending, textarea, file, openEmoji, pickFile, onFile, canSend }
  }
}
</script>