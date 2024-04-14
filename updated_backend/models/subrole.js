'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subrole extends Model {
    static associate(models) {
    }
  }
  Subrole.init({
    SubroleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    SubroleName: {
      type: DataTypes.ENUM('Intern', 'Employee')
    }
  }, {
    sequelize,
    modelName: 'Subrole',
    timestamps:false
  });
  return Subrole;
};
