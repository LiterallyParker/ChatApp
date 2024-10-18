'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("ChatroomUsers", {
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
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      chatroomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Chatrooms",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addConstraint("ChatroomUsers", {
      fields: ["userId", "chatroomId"],
      type: "unique",
      name: "unique_user_chatroom"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("ChatroomUsers", "unique_user_chatroom");
    await queryInterface.dropTable("ChatroomUsers");
  }
};
