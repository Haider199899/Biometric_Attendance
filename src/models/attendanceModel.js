const { DataTypes } = require('sequelize');
const {sequelize}=require('../config/db_connect_config')

const Attendance = sequelize.define('Attendance', {
  // Model attributes are defined here
 
  attendanceTime: {
    type: DataTypes.DATE
  },
  employeeId:{
    type:DataTypes.INTEGER
 }

});


module.exports={Attendance}