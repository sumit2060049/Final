'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reports', {
      ReportID: {
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
      ReportDate: {
        type: Sequelize.DATE
      },
      Summary: {
        type: Sequelize.TEXT
      },
      Recommendations: {
        type: Sequelize.TEXT
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reports');
  }
};
