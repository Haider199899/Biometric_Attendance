const { DataTypes } = require('sequelize');
const {sequelize}=require('../config/db_connect_config')

const Employee = sequelize.define('Employee', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  designation:{
    type:DataTypes.STRING
  
 },
  email:{
     type:DataTypes.STRING,
     unique:true
  },
  deviceId:{
    type:DataTypes.INTEGER,
    unique:true
  },
  updatedBy:{
   type:DataTypes.STRING
  },
}, {
  paranoid: true
});
module.exports={Employee}

