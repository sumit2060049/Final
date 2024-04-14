'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TrainingAmounts', {
      AmountID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ModuleID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TrainingModules',
          key: 'ModuleID'
        }
      },
      Amount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      Currency: {
        type: Sequelize.STRING(3)
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TrainingAmounts');
  }
};
