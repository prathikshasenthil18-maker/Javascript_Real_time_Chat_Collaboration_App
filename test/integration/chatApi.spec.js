const http = require("http");
const { expect } = require("chai");
const { createApp } = require("../../backend_js/src/server");

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
        res.on("end", () => {
          resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : {} });
        });
      },
    );
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe("Chat API integration", () => {
  let server;
  before((done) => {
    const app = createApp();
    server = http.createServer(app.handler).listen(0, "127.0.0.1", done);
  });
  after((done) => server.close(done));

  it("health + version", async () => {
    const health = await request(server, "GET", "/api/v1/health");
    expect(health.status).to.equal(200);
    expect(health.body.status).to.equal("healthy");
    const version = await request(server, "GET", "/api/v1/version");
    expect(version.body.frontend_node).to.not.equal(version.body.backend_node);
  });

  it("join send history leave", async () => {
    const join = await request(server, "POST", "/api/v1/rooms/general/join", {
      userId: "Visvantha",
    });
    expect(join.body.ok).to.equal(true);
    const send = await request(server, "POST", "/api/v1/rooms/general/messages", {
      userId: "Visvantha",
      text: "hello-chat",
    });
    expect(send.body.ok).to.equal(true);
    const history = await request(server, "GET", "/api/v1/rooms/general/messages");
    const texts = (history.body.data.messages || []).map((m) => m.text);
    expect(texts).to.include("hello-chat");
    const leave = await request(server, "POST", "/api/v1/rooms/general/leave", {
      userId: "Visvantha",
    });
    expect(leave.body.ok).to.equal(true);
  });
});
