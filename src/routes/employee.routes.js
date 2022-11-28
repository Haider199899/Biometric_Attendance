const express=require('express');
const router=express.Router();
const controller=require('../controllers/employee.controller');

router.post('/login',controller.Login);
router.post('/addEmployee',controller.addEmployee);
router.get('/getEmployee',controller.getEmployee);
router.get('/getAllEmployee',controller.getAllEmployee);
router.put('/updateEmployee/:id',controller.updateEmployee)


module.exports=router