'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TrainingPlans', {
      PlanID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      PlanName: {
        type: Sequelize.STRING(255)
      },
      Description: {
        type: Sequelize.TEXT
      },
      StartDate: {
        type: Sequelize.DATE
      },
      EndDate: {
        type: Sequelize.DATE
      },
      SubroleID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subroles',
          key: 'SubroleID'
        }
      },
      CategoryID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TrainingCategories',
          key: 'CategoryID'
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TrainingPlans');
  }
};
