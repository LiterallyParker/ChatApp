const { Router } = require("express");
const chatroomRoutes = Router();
const { createChatroom, deleteChatroom } = require("../controllers/chatroom");

chatroomRoutes.post("/", createChatroom);
chatroomRoutes.delete("/:chatroomId", deleteChatroom);

module.exports = chatroomRoutes;