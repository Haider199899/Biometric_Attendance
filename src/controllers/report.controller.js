const { Employee } = require("../models/employee.model");
const { Attendance } = require("../models/attendanceModel");

const attendanceReport = async (fromDate, toDate) => {  
  const attendances = (await Attendance.findAll()).filter((item )=> {
      if((item.dataValues.attendanceTime>=new Date(fromDate)) && (item.dataValues.attendanceTime<=new Date(toDate))){
        return item
      }
  } )
  return attendances
};

const reportOfEmployee = async (req, res) => {
  try {
    const id = req.query.id;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const employee = await Employee.findOne({ where: { deviceId: id } }); 
    const weeklyData = await attendanceReport(fromDate,toDate)
    employee.dataValues.weeklyData = weeklyData
    console.log(employee.dataValues.weeklyData.length)
if(employee.dataValues.weeklyData.length!=0) {
    return res.status(200).send({
      data: employee,
      success: false,
    });
}else{
    return res.status(200).send({
        data: 'No record found!',
        success: false,
      });
}
  } catch (error) {
    return res.status(500).send({
      message: "Operation unsuccessful due to" + error,
      success: false,
    });
  }
};
const reportOfAllEmployee = async (req, res) => {
    try {
      const fromDate = req.query.fromDate;
      const toDate = req.query.toDate;
      const weeklyData = await attendanceReport(fromDate,toDate)
  if(weeklyData.length!=0) {
      return res.status(200).send({
        data: weeklyData,
        success: false,
      });
  }else{
      return res.status(200).send({
          data: 'No record found!',
          success: false,
        });
  }
    } catch (error) {
      return res.status(500).send({
        message: "Operation unsuccessful due to" + error,
        success: false,
      });
    }
};
  
module.exports = {
  reportOfAllEmployee,
  reportOfEmployee
};
