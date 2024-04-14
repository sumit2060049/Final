'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subroles', {
      SubroleID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      SubroleName: {
        type: Sequelize.ENUM('Intern', 'Employee')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Subroles');
  }
};
