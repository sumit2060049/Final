'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TrainingModule extends Model {
    static associate(models) {
      this.belongsTo(models.TrainingPlan, { foreignKey: 'PlanID' });
    }
  }
  TrainingModule.init({
    ModuleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ModuleName: {
      type: DataTypes.STRING(255)
    },
    Description: {
      type: DataTypes.TEXT
    },
    PlanID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TrainingPlans',
        key: 'PlanID'
      }
    },
    ModuleDate: {
      type: DataTypes.DATE
    },
    StartTime: {
      type: DataTypes.TIME
    },
    EndTime: {
      type: DataTypes.TIME
    }
  }, {
    sequelize,
    modelName: 'TrainingModule',
    timestamps:false
  });
  return TrainingModule;
};
