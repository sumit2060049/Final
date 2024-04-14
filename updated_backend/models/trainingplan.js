'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TrainingPlan extends Model {
    static associate(models) {
      this.belongsTo(models.Subrole, { foreignKey: 'SubroleID' });
      this.belongsTo(models.TrainingCategory, { foreignKey: 'CategoryID' });
    }
  }
  TrainingPlan.init({
    PlanID: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true
    },
    PlanName: {
      type: DataTypes.STRING(255)
    },
    Description: {
      type: DataTypes.TEXT
    },
    StartDate: {
      type: DataTypes.DATE
    },
    EndDate: {
      type: DataTypes.DATE
    },
    SubroleID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Subrole',
        key: 'SubroleID'
      }
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TrainingCategory',
        key: 'CategoryID'
      }
    }
  }, {
    sequelize,
    modelName: 'TrainingPlan',
    timestamps:false
  });
  return TrainingPlan;
};
