const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Employee } = require("../models/employee.model");
const { Attendance } = require("../models/attendanceModel");

dotenv.config({ path: ".env" });

const getAllAttendanceByDate = async (req, res) => {
  try {
    let token = req.headers.token;
    let verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      let date = req.query.date;
      //getting All Attendances from db
      const attendance = await Attendance.findAll({where:{attendanceTime:date}});

      //getting all Employees from db
      const employee = await Employee.findAll();

      //mapping attendance against its employee
      const attendanceWithUsers = attendance.map((item)=>{
        return{
        ...item.dataValues,
        employee:employee.filter(emp => emp.dataValues.id === item.employeeId)
        }
      })

      if (attendanceWithUsers.length!=0) {
        return res.status(200).send({
          data: attendanceWithUsers,
          success: true,
        });
      } else {
        return res.status(404).send({
          data: "No record found!",
          success: false,
        });
      }
    } else {
      return res.status(404).send({
        data: "You are unauthorized to perform that action!",
        success: false,
      });
    }
  } catch (error) {
    return res.status(404).send({
      data: "You are unauthorized to perform that action!" + error,
      success: false,
    });
  }
};
const getAttendanceOfUserByDate = async (req, res) => {
  try {
    let token = req.headers.token;
    let verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      let id = req.query.id;
      let date = req.query.date;

     //getting employee from db of given device Id
       const employee = await Employee.findOne({where:{deviceId:id}})

    //getting all Attendances
       const attendance = await Attendance.findAll({where:{employeeId:employee.dataValues.id,attendanceTime:date}});
       employee.dataValues.attendances = attendance

       if (employee) {
        return res.status(200).send({
          data: employee,
          success: true,
        });
      } else {
        return res.status(404).send({
          data: "No record found!",
          success: false,
        });
      }
    } else {
      return res.status(404).send({
        data: "You are unauthorized to perform that action!",
        success: false,
      });
    }
  } catch (error) {
    return res.status(404).send({
      data: "You are unauthorized to perform that action!" + error,
      success: false,
    });
  }
}
module.exports = {
  getAllAttendanceByDate,
  getAttendanceOfUserByDate
};
