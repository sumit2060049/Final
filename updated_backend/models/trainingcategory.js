'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TrainingCategory extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  TrainingCategory.init({
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CategoryName: {
      type: DataTypes.STRING
    },
    CategoryExplain: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'TrainingCategory',
    timestamps:false
  });
  return TrainingCategory;
};
