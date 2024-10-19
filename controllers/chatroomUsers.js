const { ChatroomUser, User, Chatroom } = require("../models");
const { successResponse, errorResponse, ERROR_MESSAGES, validateChatroomOwner } = require("../util");

const addUserToChatroom = async ( req, res ) => {
    const { userId, chatroomId } = req.body;
    const { id: ownerId } = req.user;

    try {
        const isChatroomOwner = await validateChatroomOwner(chatroomId, ownerId);

        if (!isChatroomOwner) {
            return res.status(400).json(errorResponse("NewChatroomUser", ERROR_MESSAGES.chatroomPermissions));
        };

        const existingUser = await ChatroomUser.findOne({
            where: {
                userId,
                chatroomId
            }
        });
        
        if (existingUser) {
            return res.status(400).json(errorResponse("NewChatroomUser", ERROR_MESSAGES.userInChatroom));
        };
        
        const newChatroomUser = await ChatroomUser.create({
            userId,
            chatroomId
        });
        
        const { name: chatroomName } = await Chatroom.findByPk(chatroomId);
        const { username } = await User.findByPk(userId);

        return res.status(200).json(successResponse({
            chatroomUser: newChatroomUser,
            message: `${username} has been added to ${chatroomName}.`
        }));

    } catch (error) {
        console.error("Error adding user to chatroom:", error);
        return res.status(500).json(errorResponse("NewChatroomUser", ERROR_MESSAGES.newChatroomUser));
    }
};

const removeUserFromChatroom = async ( req, res ) => {
    const { userId, chatroomId } = req.body;

    try {
        const chatroomUser = await ChatroomUser.findOne({
            where: {
                userId,
                chatroomId
            }
        });

        if (!chatroomUser) {
            return errorResponse("RemoveChatroomUser", ERROR_MESSAGES.userNotInChatroom);
        };

        await ChatroomUser.destroy({
            where: {
                userId,
                chatroomId
            }
        });

        const { username } = await User.findByPk(userId);
        const { name: chatroomName } = await Chatroom.findByPk(chatroomId);

        return successResponse({ message: `${username} was removed from ${chatroomName}.`});

    } catch (error) {
        console.error("Error removing user from chatroom:", error);
        return errorResponse("RemoveChatroomUser", ERROR_MESSAGES.removingChatroomUser);
    };
};

module.exports = {
    addUserToChatroom,
    removeUserFromChatroom
};