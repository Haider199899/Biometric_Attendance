const { DataTypes } = require('sequelize');
const {sequelize}=require('../config/db_connect_config')

const Employee = sequelize.define('Employee', {
  // Model attributes are defined here
 
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
  }
});

module.exports={Employee};

