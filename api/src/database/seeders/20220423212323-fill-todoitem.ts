'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('todoitem', [
      {
        id: 1,
        description: 'Go to the shop',
        selected: true,
        directoryId: 1,
        userId: 1
      },
      {
        id: 2,
        description: 'Buy carrots',
        selected: false,
        directoryId: 1,
        userId: 1
      },
      {
        id: 3,
        description: 'Do the homework',
        selected: true,
        directoryId: 1,
        userId: 1
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('todoitem', null, {});
  },
};
