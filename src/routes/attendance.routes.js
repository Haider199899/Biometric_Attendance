const express = require("express");
const attendanceRouter = express.Router();
const utils = require("../utils/zk.Attendance");
const controller = require("../controllers/attendance.controller");
const auth = require("../middlewares/auth");
const { Joi, celebrate, Segments } = require("celebrate");
attendanceRouter.get(
  "/attendances/employees",
  auth,
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      date: Joi.date().required(),
    }),
  }),
  controller.getAllAttendanceByDate
);
attendanceRouter.post("/attendances/sync", auth, utils.syncWithDatabase);
module.exports = attendanceRouter;
