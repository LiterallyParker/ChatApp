const { Router } = require("express");
const chatroomRoutes = Router();
const { errorResponse, ERROR_MESSAGES } = require("../util");
const { createChatroom, deleteChatroom } = require("../controllers/chatroom");
const { requireUser } = require("../auth");

chatroomRoutes.post("/create", requireUser, createChatroom);
chatroomRoutes.post("/delete", requireUser, deleteChatroom);

module.exports = chatroomRoutes;