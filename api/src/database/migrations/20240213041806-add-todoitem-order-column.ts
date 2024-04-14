'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('todoitem', 'order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('todoitem', 'order');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
