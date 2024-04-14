'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TrainingCategories', {
      CategoryID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      CategoryName: {
        type: Sequelize.STRING
      },
      CategoryExplain: {
        type: Sequelize.TEXT
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TrainingCategories');
  }
};
