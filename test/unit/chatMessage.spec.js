const { expect } = require("chai");
const { createChatMessage } = require("../../shared/src/ChatMessage");
const { getVersionInfo } = require("../../shared/src/VersionInfo");

describe("shared ChatMessage", () => {
  it("creates message", () => {
    const msg = createChatMessage({ roomId: "general", userId: "u1", text: "hi" });
    expect(msg.roomId).to.equal("general");
    expect(msg.text).to.equal("hi");
  });
  it("rejects invalid", () => {
    expect(() => createChatMessage({ roomId: "r" })).to.throw("invalid_chat_message");
  });
  it("version info matches branch", () => {
    const v = getVersionInfo();
    expect(v.branch).to.match(/^JS_FE\d+_BE\d+$/);
    expect(v.frontend_node).to.not.equal(v.backend_node);
  });
});
