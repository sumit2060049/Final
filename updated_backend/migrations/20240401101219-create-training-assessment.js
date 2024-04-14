'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TrainingAssessments', {
      AssessmentID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      UserID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'UserID'
        }
      },
      ModuleID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TrainingModules',
          key: 'ModuleID'
        }
      },
      Score: {
        type: Sequelize.INTEGER
      },
      DateCompleted: {
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TrainingAssessments');
  }
};
