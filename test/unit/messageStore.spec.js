const { expect } = require("chai");
const { MessageStore } = require("../../backend_js/src/MessageStore");
const { createChatMessage } = require("../../shared/src/ChatMessage");

describe("MessageStore", () => {
  it("saves and lists", () => {
    const store = new MessageStore();
    store.save(createChatMessage({ roomId: "r1", userId: "u", text: "a" }));
    store.save(createChatMessage({ roomId: "r1", userId: "u", text: "b" }));
    expect(store.listByRoom("r1")).to.have.length(2);
    expect(store.lastInRoom("r1").text).to.equal("b");
  });
});
