'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('todoitem', [
      {
        id: 1,
        description: 'Go to the shop',
        selected: true,
      },
      {
        id: 2,
        description: 'Buy carrots',
        selected: false,
      },
      {
        id: 3,
        description: 'Do the homework',
        selected: true,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('todoitem', null, {});
  },
};
