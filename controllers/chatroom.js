const { Chatroom, ChatroomUser, ChatroomMessage } = require("../models");
const { errorResponse, successResponse, ERROR_MESSAGES } = require("../util");

const createChatroom = async ( req, res ) => {
    const { name, chatType, isPrivate, userIds } = req.body;
    const { id: userId } = req.user;

    try {
        const conflictingChatroom = await Chatroom.findOne({
            where: {
                name
            }
        });
        if (conflictingChatroom) {
            return res.status(400).json(errorResponse("CreateChatroom", ERROR_MESSAGES.conflictingChatroomName));
        };

        if (!chatType || !['group', 'one-on-one'].includes(chatType)) {
            return res.status(400).json(errorResponse("CreateChatroom", ERROR_MESSAGES.invalidChatroom));
        };

        const newChatroom = await Chatroom.create({
            name: name || null,
            createdBy: userId,
            chatType,
            isPrivate: isPrivate ?? true
        });

        await ChatroomUser.create({
            userId,
            chatroomId: newChatroom.id
        });

        if (Array.isArray(userIds) && userIds.length > 0) {
            const validUserIds = userIds.filter(id => id !== userId);

            const chatroomUsers = validUserIds.map(id => ({
                userId: id,
                chatroomId: newChatroom.id
            }));

            if (chatroomUsers.length > 0) {
                await ChatroomUser.bulkCreate(chatroomUsers);
            };
        };

        return res.status(200).json(successResponse({
            chatroom: newChatroom,
            message: "Chatroom created successfully."
        }));

    } catch (error) {
        console.error("Error creating chatroom:", error);
        return res.status(500).json(errorResponse("CreateChatroom", ERROR_MESSAGES.creatingChatroom));
    };
};

const deleteChatroom = async ( req, res ) => {
    const { chatroomId } = req.params;
    const { id: userId } = req.user;

    try {
        const chatroom = await Chatroom.findOne({
            where: {
                id: chatroomId,
                createdBy: userId
            }
        });

        if (!chatroom) {
            return res.status(404).json(errorResponse("DeleteChatroom", ERROR_MESSAGES.chatroomNotFound));
        };

        const chatroomName = chatroom.name;

        await ChatroomUser.destroy({
            where: {
                chatroomId: chatroomId
            }
        });

        await ChatroomMessage.destroy({
            where: {
                chatroomId: chatroomId
            }
        });

        await Chatroom.destroy({
            where: {
                id: chatroomId
            }
        });

        return res.status(200).json(successResponse({
            message: `Chatroom ${chatroomName} successfully deleted.`
        }));

    } catch (error) {
        console.error(`Error deleting chatroom:`, error);
        return res.status(500).json(errorResponse("DeleteChatroom", ERROR_MESSAGES.deletingChatroom));
    };
};

const changeChatroomName = async ( req, res ) => {
    const { chatroomId, newName } = req.body;
    const { id: userId } = req.user;

    try {

        if (!newName || newName.trim() === "") {
            return res.status(400).json(errorResponse("ChangeChatroomName", ERROR_MESSAGES.invalidChatroomName))
        }

        const chatroom = await Chatroom.findOne({
            where: {
                id: chatroomId,
                createdBy: userId
            }
        });

        if (!chatroom) {
            return res.status(400).json(errorResponse("ChangeChatroomName", ERROR_MESSAGES.chatroomPermissions));
        };

        const oldName = chatroom.name;
        chatroom.name = newName;

        if (oldName === newName) {
            res.status(400).json(errorResponse("ChangeChatroomName", ERROR_MESSAGES.sameChatroomName))
        }
        
        await chatroom.save();

        return res.status(200).json(successResponse({
            chatroom,
            oldName,
            newName,
            message: "Chatroom name changed successfully."
        }));

    } catch (error) {
        console.error("Error changing chatroom name:", error);
        return res.status(500).json(errorResponse("ChangeChatroomName", ERROR_MESSAGES.changingChatroomName));
    };
};

module.exports = {
    createChatroom,
    deleteChatroom,
    changeChatroomName
};