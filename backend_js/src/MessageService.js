const { createChatMessage } = require("../../shared/src/ChatMessage");
const { ok, fail } = require("../../shared/src/ChatResponse");

class MessageService {
  constructor(store, rooms, stats) {
    this.store = store;
    this.rooms = rooms;
    this.stats = stats;
  }
  send(payload) {
    try {
      this.rooms.ensure(payload.roomId);
      const message = createChatMessage(payload);
      this.store.save(message);
      this.stats.messagesSent += 1;
      return ok({ message });
    } catch (err) {
      return fail("send_failed", err.message);
    }
  }
  history(roomId) {
    this.rooms.ensure(roomId);
    const messages = this.store.listByRoom(roomId);
    this.stats.messagesListed += 1;
    return ok({ roomId, messages });
  }
}
module.exports = { MessageService };
