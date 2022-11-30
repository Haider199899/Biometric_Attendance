const express=require('express');
const reportRouter=express.Router()
const {weeklyReport} = require("../controllers/report.controller");
reportRouter.get('/weeklyReport',weeklyReport)
//reportRouter.get('/monthlyReport')
module.exports=reportRouter