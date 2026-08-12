const http = require("http");
const { expect } = require("chai");
const { createApp } = require("../../backend_js/src/server");
const expected = require("../../fixtures/sample/expected-chat-output.json");

function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const req = http.request(
      {
        host: "127.0.0.1",
        port: addr.port,
        path,
        method,
        headers: { "Content-Type": "application/json" },
      },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => resolve(JSON.parse(raw || "{}")));
      },
    );
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe("E2E chat flow", () => {
  let server;
  before((done) => {
    const app = createApp();
    server = http.createServer(app.handler).listen(0, "127.0.0.1", done);
  });
  after((done) => server.close(done));

  it("full collaboration path", async () => {
    await request(server, "POST", "/api/v1/rooms/general/join", { userId: "Visvantha" });
    const send = await request(server, "POST", "/api/v1/rooms/general/messages", {
      userId: "Visvantha",
      text: "hello-chat",
    });
    expect(send.ok).to.equal(expected.ok);
    const history = await request(server, "GET", "/api/v1/rooms/general/messages");
    const texts = history.data.messages.map((m) => m.text);
    expect(texts).to.include(expected.containsText);
    const stats = await request(server, "GET", "/api/v1/stats");
    expect(stats.data.messagesSent).to.be.at.least(1);
  });
});
