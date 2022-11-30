const express=require('express');
const attendanceRouter=express.Router();
const utils=require('../utils/zk.Attendance')
const controller=require('../controllers/attendance.controller');
const dotenv=require('dotenv');
const {attendanceData} = require("../utils/zk.Attendance");
dotenv.config({ path: '.env'})
attendanceRouter.get('/attendance/allAttendanceByDate',controller.getAllAttendanceByDate)
attendanceRouter.get('/attendance/attendanceOfUserByDate',controller.getAttendanceOfUserByDate)
attendanceRouter.get('/attendance/attendanceBetweenDates',controller.geAttendanceByDateRange)
attendanceRouter.post('/attendance/sync',utils.syncWithDatabase)
module.exports=attendanceRouter;