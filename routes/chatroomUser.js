const { Router } = require('express');
const chatroomUserRoutes = Router();
const { addUserToChatroom, removeUserFromChatroom } = require('../controllers/chatroomUsers');
const { getUsersByChatroom } = require('../controllers/user');

chatroomUserRoutes.post('/', addUserToChatroom);
chatroomUserRoutes.delete('/', removeUserFromChatroom);
chatroomUserRoutes.get('/:chatroomId', getUsersByChatroom);

module.exports = chatroomUserRoutes;