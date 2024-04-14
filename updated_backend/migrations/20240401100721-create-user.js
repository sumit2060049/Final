'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      UserID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Username: {
        type: Sequelize.STRING(255)
      },
      Password: {
        type: Sequelize.STRING(255)
      },
      Email: {
        type: Sequelize.STRING(255),
        unique: true
      },
      IsChanged: {
        type: Sequelize.BOOLEAN
      },
      Designation: {
        type: Sequelize.ENUM('Admin', 'User', 'Trainer', 'Hr')
      },
      SubroleID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subroles',
          key: 'SubroleID'
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
