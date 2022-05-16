'use strict';
/* eslint-disable  */
const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [
      {
        id: 1,
        name: 'Diego',
        surname: 'Sosa',
        username: 'dhsosa',
        password: await bcrypt.hash('1234', Number(process.env.HASH_SALT) || 10),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  },
};
