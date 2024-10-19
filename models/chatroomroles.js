'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatroomRole extends Model {
    static associate(models) {
      // Each role belongs to one chatroom
      ChatroomRole.belongsTo(models.Chatroom, {
        foreignKey: 'chatroomId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      ChatroomRole.belongsToMany(models.User, {
        through: models.ChatroomUserRole,
        foreignKey: 'roleId',
        otherKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    };
  };

  ChatroomRole.init({
    chatroomId: DataTypes.INTEGER,
    roleName: DataTypes.STRING,
    permissions: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ChatroomRole',
  });
  return ChatroomRole;
};