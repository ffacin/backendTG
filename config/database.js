const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('projetoMobile_TG', 'admin', 'banco123', {
  host: 'projeto-tg.cfae0qo0q365.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',
  port: 3306,
});

module.exports = sequelize;
