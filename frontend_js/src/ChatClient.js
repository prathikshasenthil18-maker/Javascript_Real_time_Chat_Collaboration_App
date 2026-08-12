        // frontend ChatClient helpers — Node 18 / ES2022 only
export function hasOwn(obj, key) {
  return Object.hasOwn(obj ?? {}, key);
}
export function lastItem(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.at(-1) ?? null;
}
export function sortDesc(values) {
  return [...(values ?? [])].sort((a, b) => b - a);
}
export function findLastActive(items) {
  const list = Array.isArray(items) ? items : [];
  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (list[i]?.active) return list[i];
  }
  return null;
}


        export class ChatClient {
          constructor(baseUrl) {
            this.baseUrl = baseUrl || "";
          }
          async getJson(path) {
            const res = await fetch(this.baseUrl + path);
            return res.json();
          }
          async postJson(path, body) {
            const res = await fetch(this.baseUrl + path, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body ?? {}),
            });
            return res.json();
          }
          health() { return this.getJson("/api/v1/health"); }
          version() { return this.getJson("/api/v1/version"); }
          rooms() { return this.getJson("/api/v1/rooms"); }
          stats() { return this.getJson("/api/v1/stats"); }
          join(roomId, userId) {
            return this.postJson("/api/v1/rooms/" + encodeURIComponent(roomId) + "/join", { userId });
          }
          leave(roomId, userId) {
            return this.postJson("/api/v1/rooms/" + encodeURIComponent(roomId) + "/leave", { userId });
          }
          history(roomId) {
            return this.getJson("/api/v1/rooms/" + encodeURIComponent(roomId) + "/messages");
          }
          send(roomId, userId, text) {
            return this.postJson("/api/v1/rooms/" + encodeURIComponent(roomId) + "/messages", {
              userId,
              text,
            });
          }
        }
