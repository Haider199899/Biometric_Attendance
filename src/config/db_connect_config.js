const {Sequelize}=require('sequelize');
const dbConfig=require('./db.config')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port:dbConfig.port,
  dialect: 'postgres',/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

// sequelize.sync({ force: true });

module.exports={sequelize}
