const express=require('express');
const router=express.Router();
const empController=require('../controllers/employee.controller');
const repController = require('../controllers/report.controller')
const attController = require('../controllers/attendance.controller')

router.post('/hr/login',empController.Login);
router.post('/employees',empController.addEmployee);
router.get('/employees/reports', repController.reportOfAllEmployee);
router.get('/employees',empController.getAllEmployee);
router.get('/employees/:id',empController.getEmployee);
router.put('/employees/:id',empController.updateEmployee);
router.get('/employees/:id/attendances',attController.getAttendanceOfUserByDate)
router.get('/employees/:id/report',repController.reportOfEmployee);

module.exports=router