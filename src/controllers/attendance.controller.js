const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sequelize = require("sequelize");
const { Employee } = require("../models/employee.model");
const { Attendance } = require("../models/attendanceModel");
const moment = require("moment");

dotenv.config({ path: ".env" });
const Op = sequelize.Op;
const getAllAttendanceByDate = async (req, res, next) => {
  try {
    let date = req.query.date;
    let startOfDay = moment(new Date(date)).startOf("day").format();
    let endOfDay = moment(new Date(date)).endOf("day").format();
    //getting All Attendances from db
    const attendance = await Attendance.findAll({
      where: {
        attendanceTime: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });
    //Mapping employee against its attendance
    for (let i = 0; i < attendance.length; i++) {
      let employeeId = attendance[i].dataValues.employeeId;
      const employee = await Employee.findOne({ where: { id: employeeId } });
      attendance[i].dataValues.employee = employee.dataValues;
    }

    if (attendance.length != 0) {
      return res.status(200).send({
        data: attendance,
        success: true,
      });
    } else {
      return res.status(404).send({
        data: "No record found!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getAttendanceOfUserByDate = async (req, res, next) => {
  try {
    let id = req.params.id;
    let date = req.query.date;

    let startOfDay = moment(date).startOf("day").format();
    let endOfDay = moment(date).endOf("day").format();

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
    employee.dataValues.attendances = attendance;
    if (attendance.length != 0) {
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
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllAttendanceByDate,
  getAttendanceOfUserByDate,
};
