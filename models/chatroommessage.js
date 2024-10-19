'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatroomMessage extends Model {

    static associate(models) {
      // Each ChatroomMessage belongs to one User
      ChatroomMessage.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Each ChatroomMessage belongs to one Chatroom
      ChatroomMessage.belongsTo(models.Chatroom, {
        foreignKey: 'chatroomId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  ChatroomMessage.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    chatroomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chatroom',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ChatroomMessage',
  });

  return ChatroomMessage;
};
