class RoomManager {
  constructor(presence) {
    this.presence = presence;
    this.rooms = new Map();
  }
  ensure(roomId) {
    const id = String(roomId || "").trim();
    if (!id) throw new Error("room_id_required");
    if (!this.rooms.has(id)) {
      this.rooms.set(id, { id, createdAt: new Date().toISOString() });
    }
    return this.rooms.get(id);
  }
  list() {
    return [...this.rooms.values()];
  }
  join(roomId, userId) {
    this.ensure(roomId);
    return this.presence.join(roomId, String(userId));
  }
  leave(roomId, userId) {
    this.ensure(roomId);
    return this.presence.leave(roomId, String(userId));
  }
  count() {
    return this.rooms.size;
  }
}
module.exports = { RoomManager };
