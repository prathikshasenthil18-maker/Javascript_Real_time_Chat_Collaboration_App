class ChatStatistics {
  constructor() {
    this.messagesSent = 0;
    this.messagesListed = 0;
    this.joins = 0;
    this.leaves = 0;
  }
  snapshot(store, rooms, presence) {
    return {
      messagesSent: this.messagesSent,
      messagesListed: this.messagesListed,
      joins: this.joins,
      leaves: this.leaves,
      roomCount: rooms.count(),
      activePresenceCount: presence.activeCount(),
      entryCount: store.count(),
    };
  }
}
module.exports = { ChatStatistics };
