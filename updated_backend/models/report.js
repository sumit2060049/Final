'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'UserID' });
      this.belongsTo(models.TrainingModule, { foreignKey: 'ModuleID' });
    }
  }
  Report.init({
    ReportID: {
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
        model: 'TrainingModule',
        key: 'ModuleID'
      }
    },
    ReportDate: {
      type: DataTypes.DATE
    },
    Summary: {
      type: DataTypes.TEXT
    },
    Recommendations: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Report',
    timestamps:false
  });
  return Report;
};
