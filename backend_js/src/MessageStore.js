        // backend MessageStore helpers — Node 18 / ES2022 only
function hasOwn(obj, key) {
  return Object.hasOwn(obj ?? {}, key);
}
function lastItem(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.at(-1) ?? null;
}
function sortDesc(values) {
  return [...(values ?? [])].sort((a, b) => b - a);
}
function findLastActive(items) {
  const list = Array.isArray(items) ? items : [];
  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (list[i]?.active) return list[i];
  }
  return null;
}

        class MessageStore {
          constructor() {
            this.byRoom = new Map();
          }
          save(message) {
            const list = this.byRoom.get(message.roomId) || [];
            list.push(message);
            this.byRoom.set(message.roomId, list);
            return message;
          }
          listByRoom(roomId) {
            return (this.byRoom.get(roomId) || []).slice();
          }
          count() {
            let n = 0;
            for (const list of this.byRoom.values()) n += list.length;
            return n;
          }
          lastInRoom(roomId) {
            return lastItem(this.listByRoom(roomId));
          }
        }
        module.exports = { MessageStore, hasOwn, sortDesc, findLastActive };
