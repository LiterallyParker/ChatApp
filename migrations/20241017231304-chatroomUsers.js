'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("ChatroomUser", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      chatroomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Chatroom",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
      }
    });

    await queryInterface.addConstraint("ChatroomUser", {
      fields: ["userId", "chatroomId"],
      type: "unique",
      name: "unique_user_chatroom"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("ChatroomUser", "unique_user_chatroom");
    await queryInterface.dropTable("ChatroomUser");
  }
};
