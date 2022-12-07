const express=require('express');
const attendanceRouter=express.Router();
const utils=require('../utils/zk.Attendance')
const controller=require('../controllers/attendance.controller');
const dotenv=require('dotenv');
dotenv.config({ path: '.env'})
attendanceRouter.get('/attendances/employees',controller.getAllAttendanceByDate)
attendanceRouter.post('/attendances/sync',utils.syncWithDatabase)
module.exports=attendanceRouter;