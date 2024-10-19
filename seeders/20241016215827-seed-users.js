'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('User', [
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'JDoe69',
        email: 'parkernash2001@gmail.com',
        hash: await bcrypt.hash("Password01!", 4),
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Sally',
        lastName: 'Magee',
        username: 'SMagee05',
        email: 'email01@website.com',
        hash: await bcrypt.hash("Password02!", 4),
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Paul',
        lastName: 'Blart',
        username: 'MallCop911',
        email: 'email03@website.com',
        hash: await bcrypt.hash("Password03!", 4),
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete('User', null, {});
  }
};
