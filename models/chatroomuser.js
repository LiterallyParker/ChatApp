'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatroomUser extends Model {

    static associate(models) {
      // Each ChatroomUser belongs to one User
      ChatroomUser.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Each ChatroomUser belongs to one Chatroom
      ChatroomUser.belongsTo(models.Chatroom, {
        foreignKey: 'chatroomId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  ChatroomUser.init({
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
    }
  }, {
    sequelize,
    modelName: 'ChatroomUser',
  });

  return ChatroomUser;
};