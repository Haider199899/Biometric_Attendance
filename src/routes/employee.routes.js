const express = require("express");
const router = express.Router();
const { Joi, celebrate, Segments } = require("celebrate");
const empController = require("../controllers/employee.controller");
const repController = require("../controllers/report.controller");
const attController = require("../controllers/attendance.controller");
const auth = require("../middlewares/auth");

router.post(
  "/hr/login",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  empController.Login
);
router.post(
  "/employees",
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      designation: Joi.string().required(),
      deviceId: Joi.number().required(),
    }),
  }),
  empController.addEmployee
);
router.get(
  "/employees/reports",
  auth,
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      fromDate: Joi.date().required(),
      toDate: Joi.date().required(),
    }),
  }),
  repController.reportOfAllEmployee
);
router.get("/employees", auth, empController.getAllEmployee);
router.get(
  "/employees/:id",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),

  empController.getEmployee
);
router.put(
  "/employees/:id",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      designation: Joi.string().required(),
      deviceId: Joi.number().required(),
    }),
  }),
  empController.updateEmployee
);
router.get(
  "/employees/:id/attendances",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
      date: Joi.date().required(),
    }),
  }),
  attController.getAttendanceOfUserByDate
);
router.get(
  "/employees/:id/report",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
      fromDate: Joi.date().required(),
      toDate: Joi.date().required(),
    }),
  }),
  repController.reportOfEmployee
);

module.exports = router;
