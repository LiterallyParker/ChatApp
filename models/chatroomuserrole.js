'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatroomUserRole extends Model {
    static associate(models) {
      ChatroomUserRole.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      ChatroomUserRole.belongsTo(models.ChatroomRole, {
        foreignKey: 'roleId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    };
  };

  ChatroomUserRole.init({
    userId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChatroomUserRole',
  });
  return ChatroomUserRole;
};