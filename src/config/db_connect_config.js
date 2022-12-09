const {Sequelize}=require('sequelize');
const dotenv = require('dotenv')
dotenv.config({path:'.env'})
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.PASSWORD, {
  host: process.env.HOST,
  port:process.env.DB_PORT,
  dialect: process.env.DIALECT
});
module.exports={sequelize}
