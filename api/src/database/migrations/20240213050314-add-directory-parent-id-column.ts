'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('directory', 'parentId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('directory', 'parentId');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
