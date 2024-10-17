'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'JDoe69',
        email: 'parkernash2001@gmail.com',
        hash: await bcrypt.hash("Password01!", 4),
        role: "GST",
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
        role: "GST",
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
        role: "OWN",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Users', null, {});
  }
};
