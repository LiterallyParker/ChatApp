const { Router } = require('express');
const chatroomMessageRoutes = Router();
const { getMessages, addMessage, removeMessage } = require("../controllers/chatroomMessage");
const { requireUser } = require('../auth');

chatroomMessageRoutes.get("/:chatroomId", getMessages);
chatroomMessageRoutes.post("/:chatroomId", requireUser, addMessage);
chatroomMessageRoutes.delete("/", requireUser, removeMessage)

module.exports = chatroomMessageRoutes;