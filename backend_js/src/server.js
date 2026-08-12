const http = require("http");
const { MessageStore } = require("./MessageStore");
const { PresenceRegistry } = require("./PresenceRegistry");
const { RoomManager } = require("./RoomManager");
const { ChatStatistics } = require("./ChatStatistics");
const { MessageService } = require("./MessageService");
const { createChatApi } = require("./ChatApi");
const { ChatConfiguration } = require("../../shared/src/ChatConfiguration");
const sample = require("../../data/sample-chat-data.json");

function createApp() {
  const store = new MessageStore();
  const presence = new PresenceRegistry();
  const rooms = new RoomManager(presence);
  const stats = new ChatStatistics();
  const messages = new MessageService(store, rooms, stats);

  for (const room of sample.rooms || []) rooms.ensure(room.id);
  for (const msg of sample.messages || []) {
    messages.send(msg);
  }

  const handler = createChatApi({ rooms, presence, messages, stats, store });
  return { handler, store, rooms, presence, stats, messages };
}

function start(port) {
  const app = createApp();
  const server = http.createServer(app.handler);
  server.listen(port, "127.0.0.1", () => {
    console.log(
      JSON.stringify({
        listening: true,
        port,
        branch: ChatConfiguration.branch,
        backend_node: ChatConfiguration.backendNode,
      }),
    );
  });
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT || ChatConfiguration.defaultPort);
  start(port);
}

module.exports = { createApp, start };
