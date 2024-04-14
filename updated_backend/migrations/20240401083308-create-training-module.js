'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TrainingModules', {
      ModuleID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ModuleName: {
        type: Sequelize.STRING(255)
      },
      Description: {
        type: Sequelize.TEXT
      },
      PlanID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TrainingPlans',
          key: 'PlanID'
        }
      },
      ModuleDate: {
        type: Sequelize.DATE
      },
      StartTime: {
        type: Sequelize.TIME
      },
      EndTime: {
        type: Sequelize.TIME
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TrainingModules');
  }
};
