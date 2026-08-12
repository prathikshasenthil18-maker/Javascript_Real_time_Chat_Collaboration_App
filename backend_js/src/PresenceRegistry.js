class PresenceRegistry {
  constructor() {
    this.rooms = new Map(); // roomId -> Map(userId -> {userId, active, at})
  }
  join(roomId, userId) {
    if (!this.rooms.has(roomId)) this.rooms.set(roomId, new Map());
    const members = this.rooms.get(roomId);
    members.set(userId, { userId, active: true, at: new Date().toISOString() });
    return { roomId, userId, active: true };
  }
  leave(roomId, userId) {
    const members = this.rooms.get(roomId);
    if (!members) return { roomId, userId, active: false };
    members.set(userId, { userId, active: false, at: new Date().toISOString() });
    return { roomId, userId, active: false };
  }
  list(roomId) {
    const members = this.rooms.get(roomId);
    if (!members) return [];
    return [...members.values()];
  }
  activeCount() {
    let n = 0;
    for (const members of this.rooms.values()) {
      for (const m of members.values()) if (m.active) n += 1;
    }
    return n;
  }
}
module.exports = { PresenceRegistry };
