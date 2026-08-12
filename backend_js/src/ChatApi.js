const { ok, fail } = require("../../shared/src/ChatResponse");
const { getVersionInfo } = require("../../shared/src/VersionInfo");

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (c) => {
      body += c;
      if (body.length > 1e6) reject(new Error("body_too_large"));
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

function sendJson(res, status, payload) {
  const raw = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(raw);
}

function createChatApi(ctx) {
  const { rooms, presence, messages, stats, store } = ctx;

  return async function handler(req, res) {
    const url = new URL(req.url, "http://127.0.0.1");
    const { pathname } = url;

    if (req.method === "OPTIONS") {
      return sendJson(res, 204, {});
    }

    try {
      if (req.method === "GET" && pathname === "/api/v1/health") {
        return sendJson(res, 200, {
          status: "healthy",
          chat: "available",
          rooms: rooms.count(),
        });
      }
      if (req.method === "GET" && pathname === "/api/v1/version") {
        return sendJson(res, 200, getVersionInfo());
      }
      if (req.method === "GET" && pathname === "/api/v1/rooms") {
        return sendJson(res, 200, ok({ rooms: rooms.list() }));
      }
      if (req.method === "GET" && pathname === "/api/v1/stats") {
        return sendJson(res, 200, ok(stats.snapshot(store, rooms, presence)));
      }

      const joinMatch = pathname.match(/^\/api\/v1\/rooms\/([^/]+)\/join$/);
      if (req.method === "POST" && joinMatch) {
        const body = await readJson(req);
        const roomId = decodeURIComponent(joinMatch[1]);
        const userId = body.userId;
        if (!userId) return sendJson(res, 400, fail("user_required", "userId required"));
        const result = rooms.join(roomId, userId);
        stats.joins += 1;
        return sendJson(res, 200, ok(result));
      }

      const leaveMatch = pathname.match(/^\/api\/v1\/rooms\/([^/]+)\/leave$/);
      if (req.method === "POST" && leaveMatch) {
        const body = await readJson(req);
        const roomId = decodeURIComponent(leaveMatch[1]);
        const userId = body.userId;
        if (!userId) return sendJson(res, 400, fail("user_required", "userId required"));
        const result = rooms.leave(roomId, userId);
        stats.leaves += 1;
        return sendJson(res, 200, ok(result));
      }

      const msgMatch = pathname.match(/^\/api\/v1\/rooms\/([^/]+)\/messages$/);
      if (msgMatch) {
        const roomId = decodeURIComponent(msgMatch[1]);
        if (req.method === "GET") {
          return sendJson(res, 200, messages.history(roomId));
        }
        if (req.method === "POST") {
          const body = await readJson(req);
          return sendJson(
            res,
            200,
            messages.send({
              roomId,
              userId: body.userId,
              text: body.text,
              meta: body.meta,
            }),
          );
        }
      }

      return sendJson(res, 404, fail("not_found", "route not found"));
    } catch (err) {
      return sendJson(res, 500, fail("server_error", err.message));
    }
  };
}

module.exports = { createChatApi };
