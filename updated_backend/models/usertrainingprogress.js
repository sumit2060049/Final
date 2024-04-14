'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserTrainingProgress extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'UserID' });
      this.belongsTo(models.TrainingModule, { foreignKey: 'ModuleID' });
    }
  }
  UserTrainingProgress.init({
    ProgressID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'UserID'
      }
    },
    ModuleID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TrainingModules',
        key: 'ModuleID'
      }
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Inprogress', 'completed')
    },
    DateCompleted: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'UserTrainingProgress',
    timestamps:false
  });
  return UserTrainingProgress;
};
