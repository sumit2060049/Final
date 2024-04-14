'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Subrole, { foreignKey: 'SubroleID' });
    }
  }
  User.init({
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Username: {
      type: DataTypes.STRING(255)
    },
    Password: {
      type: DataTypes.STRING(255)
    },
    Email: {
      type: DataTypes.STRING(255),
      unique: true
    },
    IsChanged: {
      type: DataTypes.BOOLEAN
    },
    Designation: {
      type: DataTypes.ENUM('Admin', 'User', 'Trainer', 'Hr')
    },
    SubroleID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Subroles',
        key: 'SubroleID'
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps:false
  });
  return User;
};
