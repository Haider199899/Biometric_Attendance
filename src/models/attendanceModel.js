const { DataTypes } = require('sequelize');
const {sequelize}=require('../config/db_connect_config');
const { Employee } = require('./employee.model');

const Attendance = sequelize.define('Attendance', {
  
  attendanceTime: {
    type: DataTypes.STRING
  },
});

Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });


module.exports={Attendance}