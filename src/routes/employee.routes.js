const express=require('express');
const router=express.Router();
const controller=require('../controllers/employee.controller');

router.post('/hr/login',controller.Login);//ok
router.post('/employee/addEmployee',controller.addEmployee);//ok
router.get('/employee/getEmployee',controller.getEmployee);
router.get('/employee/getAllEmployee',controller.getAllEmployee);
router.put('/employee/updateEmployee',controller.updateEmployee);

module.exports=router