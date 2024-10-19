'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chatroom extends Model {

    static associate(models) {
      // Each Chatroom can have many ChatroomUsers
      Chatroom.hasMany(models.ChatroomUser, {
        foreignKey: 'chatroomId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Each Chatroom can have many ChatroomMessages
      Chatroom.hasMany(models.ChatroomMessage, {
        foreignKey: 'chatroomId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Each Chatroom is created by one User
      Chatroom.belongsTo(models.User, {
        foreignKey: 'createdBy',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }

  Chatroom.init({
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    chatType: {
      type: DataTypes.ENUM('group', 'one-on-one'),
      allowNull: false
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Chatroom',
  });

  return Chatroom;
};
