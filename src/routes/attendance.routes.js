const express=require('express');
const attendanceRouter=express.Router();
const utils=require('../utils/zk.Attendance')
const controller=require('../controllers/attendance.controller');
const dotenv=require('dotenv');
dotenv.config({ path: '.env'})
attendanceRouter.get('/getAttendanceAllByDate',controller.getAllAttendanceByDate)
attendanceRouter.get('/getAttendanceOfUserByDate',controller.getAttendanceOfUserByDate)
attendanceRouter.get('/getProHoursOnDate',controller.getProHoursOnDate)
attendanceRouter.get('/attendance/sync',utils.syncWithDatabase)
module.exports=attendanceRouter;