const { Employee } = require("../models/employee.model");
const { Attendance } = require("../models/attendanceModel");
const sequelize = require("sequelize");
const jwt = require('jsonwebtoken')
const Op = sequelize.Op;

const reportOfEmployee = async (req, res) => {
  try {
    const token = req.headers.token;
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      const id = req.params.id;
      const dateFrom = req.query.fromDate;
      const dateTo = req.query.toDate;
      const startOfDayDateFrom = new Date(dateFrom).setUTCHours(0, 0, 0, 0);
      const endOfDayDateTo = new Date(dateTo).setUTCHours(23, 59, 59, 999);

      const employee = await Employee.findOne({ where: { id: id } });
      const attendances = await Attendance.findAll({
        where: {
          attendanceTime: {
            [Op.between]: [startOfDayDateFrom, endOfDayDateTo],
          },
        },
      });

      employee.dataValues.attendances = attendances;

      if (employee.dataValues.attendances.length != 0) {
        return res.status(200).send({
          data: employee,
          success: false,
        });
      } else {
        return res.status(404).send({
          data: "No record found!",
          success: false,
        });
      }
    } else {
      return res.status(401).send({
        message: "You are unauthorized to perform that action!",
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
    const token = req.headers.token;
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      const fromDate = req.query.fromDate;
      const toDate = req.query.toDate;
      const startOfDayDateFrom = new Date(fromDate).setUTCHours(0, 0, 0, 0);
      const endOfDayDateTo = new Date(toDate).setUTCHours(23, 59, 59, 999);
      const attendances = await Attendance.findAll({
        where: {
          attendanceTime: {
            [Op.between]: [startOfDayDateFrom, endOfDayDateTo],
          },
        },
      });

      if (attendances.length != 0) {
        return res.status(200).send({
          data: attendances,
          success: false,
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
      message: "Operation unsuccessful due to" + error,
      success: false,
    });
  }
};

module.exports = {
  reportOfAllEmployee,
  reportOfEmployee,
};
