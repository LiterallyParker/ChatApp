const { ChatroomUser, User, Chatroom } = require("../models");
const { successResponse, errorResponse, ERROR_MESSAGES } = require("../util");

const addUserToChatroom = async ( userId, chatroomId ) => {
    try {
        
        const existingUser = await ChatroomUser.findOne({
            where: {
                userId,
                chatroomId
            }
        });
        
        if (existingUser) {
            return errorResponse("NewChatroomUser", ERROR_MESSAGES.userInChatroom);
        };
        
        const newChatroomUser = await ChatroomUser.create({
            userId,
            chatroomId
        });
        
        const { name: chatroomName } = await Chatroom.findByPk(userId);
        const { username } = await User.findByPk(userId);

        return successResponse({
            chatroomUser: newChatroomUser,
            message: `${username} has been added to ${chatroomName}.`
        });

    } catch (error) {
        console.error("Error adding user to chatroom:", error);
        return errorResponse("NewChatroomUser", ERROR_MESSAGES.newChatroomUser)
    }
};

const removeUserFromChatroom = async (userId, chatroomId) => {
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