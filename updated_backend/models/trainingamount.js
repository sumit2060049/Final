'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TrainingAmount extends Model {
    static associate(models) {
      this.belongsTo(models.TrainingModule, { foreignKey: 'ModuleID' });
    }
  }
  TrainingAmount.init({
    AmountID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ModuleID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TrainingModules',
        key: 'ModuleID'
      }
    },
    Amount: {
      type: DataTypes.DECIMAL(10, 2)
    },
    Currency: {
      type: DataTypes.STRING(3)
    }
  }, {
    sequelize,
    modelName: 'TrainingAmount',
    timestamps:false
  });
  return TrainingAmount;
};
