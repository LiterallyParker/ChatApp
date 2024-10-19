const { Router } = require("express");
const chatroomRoutes = Router();
const { createChatroom, deleteChatroom, getChatroom } = require("../controllers/chatroom");

chatroomRoutes.post("/", createChatroom);
chatroomRoutes.delete("/:chatroomId", deleteChatroom);
chatroomRoutes.get("/:chatroomId", getChatroom)

module.exports = chatroomRoutes;