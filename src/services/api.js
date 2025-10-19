import axios from 'axios'

const API_BASE = '/api'
const WS_BASE = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws'

const ws = { socket: null, callbacks: [], connect() { if (this.socket && this.socket.readyState === WebSocket.OPEN) return; this.socket = new WebSocket(WS_BASE); this.socket.onopen = () => { console.log('WS connected') }; this.socket.onmessage = (ev) => { try { const data = JSON.parse(ev.data); this.callbacks.forEach(cb => cb(data)) } catch (e) {} }; this.socket.onclose = () => { console.log('WS closed, retrying in 2s'); setTimeout(() => this.connect(), 2000) }; this.socket.onerror = () => { console.log('WS error') } }, send(payload) { if (this.socket && this.socket.readyState === WebSocket.OPEN) { this.socket.send(JSON.stringify(payload)) } else { this.connect(); setTimeout(() => { if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(payload)) }, 500) } }, onMessage(cb) { this.callbacks.push(cb); this.connect() } }

export default {
  async sendMessage(conversationId, content, meta = {}) { const res = await axios.post(`${API_BASE}/conversations/${conversationId}/messages`, { content, meta }); return res.data },
  async fetchHistory(conversationId, opts = { limit: 20, before: null }) { const params = { limit: opts.limit }; if (opts.before) params.before = opts.before; const res = await axios.get(`${API_BASE}/conversations/${conversationId}/messages`, { params }); return res.data.messages },
  async recallMessage(conversationId, messageId) { const res = await axios.post(`${API_BASE}/conversations/${conversationId}/messages/${messageId}/recall`); return res.data },
  onPush(cb) { ws.onMessage(cb) },
  wsSend(payload) { ws.send(payload) }
}
