function createChatRequest(type, payload) {
  return { type: String(type || ""), payload: payload || {}, at: new Date().toISOString() };
}
module.exports = { createChatRequest };
