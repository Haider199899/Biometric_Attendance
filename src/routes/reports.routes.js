const express=require('express');
const reportRouter=express.Router()
const {reportOfAllEmployee, reportOfEmployee} = require("../controllers/report.controller");
reportRouter.get('/report/reportOfAllEmployees',reportOfAllEmployee);
reportRouter.get('/report/reportOfEmployee',reportOfEmployee);

//reportRouter.get('/monthlyReport')
module.exports=reportRouter