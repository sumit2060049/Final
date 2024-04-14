'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TrainingAssessment extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'UserID' });
      this.belongsTo(models.TrainingModule, { foreignKey: 'ModuleID' });
    }
  }
  TrainingAssessment.init({
    AssessmentID: {
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
    Score: {
      type: DataTypes.INTEGER
    },
    DateCompleted: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'TrainingAssessment',
    timestamps:false
  });
  return TrainingAssessment;
};
