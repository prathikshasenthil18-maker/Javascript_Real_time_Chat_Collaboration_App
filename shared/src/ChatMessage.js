        function hasOwn(obj, key) {
  return Object.hasOwn(obj ?? {}, key);
}
function lastItem(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.at(-1) ?? null;
}
function sortDesc(values) {
  return (values ?? []).toSorted((a, b) => b - a);
}

        function createChatMessage(input) {
          const roomId = input?.roomId;
          const userId = input?.userId;
          const text = input?.text;
          if (!roomId || !userId || text == null || text === "") {
            throw new Error("invalid_chat_message");
          }
          return {
            id: input.id || ("msg_" + Date.now() + "_" + Math.random().toString(16).slice(2)),
            roomId: String(roomId),
            userId: String(userId),
            text: String(text),
            createdAt: input.createdAt || new Date().toISOString(),
            meta: input.meta || {},
          };
        }
        module.exports = { createChatMessage, hasOwn, lastItem };
