const { Router } = require('express');
const chatroomUserRoutes = Router();
const { addUserToChatroom, removeUserFromChatroom } = require('../controllers/chatroomUsers');

chatroomUserRoutes.post('/', addUserToChatroom);
chatroomUserRoutes.delete('/', removeUserFromChatroom);

module.exports = chatroomUserRoutes;