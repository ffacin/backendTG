const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('ProductTG', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Adicione outras colunas se necessário
}, {
  timestamps: false,
});

module.exports = Product;
