const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sequelize = require("sequelize");
const { Employee } = require("../models/employee.model");
const { Attendance } = require("../models/attendanceModel");

dotenv.config({ path: ".env" });
const Op = sequelize.Op;
const getAllAttendanceByDate = async (req, res) => {
  try {
    const token = req.headers.token;
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      let date = req.query.date;
      let startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      let endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      //getting All Attendances from db
      const attendance = await Attendance.findAll({
        where: {
          attendanceTime: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });

      //getting all Employees from db
      const employee = await Employee.findAll();

      //mapping attendance against its employee
      const attendanceWithUsers = attendance.map((item) => {
        return {
          ...item.dataValues,
          employee: employee.filter(
            (emp) => emp.dataValues.id === item.employeeId
          ),
        };
      });

      if (attendanceWithUsers.length != 0) {
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
      return res.status(401).send({
        data: "You are unauthorized to perform that action!",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).send({
      data: "You are unauthorized to perform that action!" + error,
      success: false,
    });
  }
};
const getAttendanceOfUserByDate = async (req, res) => {
  try {
    const token = req.headers.token;
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      let id = req.params.id;
      let date = req.query.date;
      let startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      let endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      //getting employee from db of given device Id
      const employee = await Employee.findOne({ where: { id: id } });
      //getting all Attendances
      const attendance = await Attendance.findAll({
        where: {
          employeeId: employee.dataValues.id,
          attendanceTime: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });
      employee.dataValues.attendances = attendances;
      if (attendance.length!=0) {
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
      return res.status(401).send({
        data: "You are unauthorized to perform that action!",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).send({
      data: "You are unauthorized to perform that action!" + error,
      success: false,
    });
  }
};
module.exports = {
  getAllAttendanceByDate,
  getAttendanceOfUserByDate,
};
