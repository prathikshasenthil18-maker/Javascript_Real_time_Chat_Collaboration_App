import { ChatClient } from "./ChatClient.js";
import { FRONTEND_NODE, BRANCH, FRONTEND_SYNTAX } from "./version.js";

export function mountDashboard(root) {
  const client = new ChatClient("");
  root.innerHTML = `
    <main class="card">
      <h1>Real-time Chat / Collaboration</h1>
      <p>Scenario <strong>2 - Split-Versions</strong></p>
      <p>Branch: <code id="branch">${BRANCH}</code></p>
      <p>Frontend Node: <strong id="fe">${FRONTEND_NODE}</strong> (ES2024 / Node.js 22)</p>
      <p>Backend Node: <strong id="be">…</strong></p>
      <p>Backend syntax: <span id="beSyntax">…</span></p>
      <p>Health: <span id="health">…</span></p>
      <div class="row">
        <input id="room" value="general" />
        <input id="user" value="Visvantha" />
        <input id="text" value="hello-chat" />
        <button id="join" type="button">Join</button>
        <button id="send" type="button">Send</button>
        <button id="history" type="button">History</button>
        <button id="leave" type="button">Leave</button>
      </div>
      <pre id="out"></pre>
    </main>
  `;

  const out = root.querySelector("#out");
  const setOut = (v) => { out.textContent = JSON.stringify(v, null, 2); };

  async function refreshMeta() {
    const version = await client.version();
    const health = await client.health();
    root.querySelector("#be").textContent = version.backend_node;
    root.querySelector("#beSyntax").textContent = version.backend_syntax || "";
    root.querySelector("#health").textContent = health.status + " / rooms=" + health.rooms;
  }

  root.querySelector("#join").onclick = async () => {
    const room = root.querySelector("#room").value;
    const user = root.querySelector("#user").value;
    setOut(await client.join(room, user));
    await refreshMeta();
  };
  root.querySelector("#send").onclick = async () => {
    const room = root.querySelector("#room").value;
    const user = root.querySelector("#user").value;
    const text = root.querySelector("#text").value;
    setOut(await client.send(room, user, text));
  };
  root.querySelector("#history").onclick = async () => {
    const room = root.querySelector("#room").value;
    setOut(await client.history(room));
  };
  root.querySelector("#leave").onclick = async () => {
    const room = root.querySelector("#room").value;
    const user = root.querySelector("#user").value;
    setOut(await client.leave(room, user));
    await refreshMeta();
  };

  refreshMeta().catch((err) => setOut({ error: String(err) }));
  return { client, syntax: FRONTEND_SYNTAX };
}
