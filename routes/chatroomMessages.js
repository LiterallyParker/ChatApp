const { Router } = require('express');
const chatroomMessageRoutes = Router();
const { getMessages, addMessage, removeMessage } = require("../controllers/chatroomMessages");
const { requireUser } = require('../auth');

chatroomMessageRoutes.get("/:chatroomId", getMessages);
chatroomMessageRoutes.post("/:chatroomId", requireUser, addMessage);

module.exports = chatroomMessageRoutes;