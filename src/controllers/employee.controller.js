const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const redis = require('redis');
const { Employee } = require("../models/employee.model");
dotenv.config({ path:".env"});
const client = redis.createClient();
const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email === "abakar@techrivers.com") {
      if (password === "abakar@@hr007") {
        //signing JWT Token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: 86400,
        });
        //connecting to redis client and saving token into redis
        client.on('connect',()=>{
          console.log('Connected to Redis!')
        })
        client.on('error',()=>{
          console.log('Not connected to Redis!')
        })
        await client.connect()
        client.set(email,token)
        console.log(await client.get(email))

        return res.status(200).send({
          message: "Login successfull",
          success: true,
          accessToken: token,
        });
      } else {
        return res.status(403).send({
          message: "Email or password is incorrect!",
          success: false,
        });
      }
    } else {
      return res.status(403).send({
        message: "Email or password is incorrect!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};
const addEmployee = async (req, res, next) => {
  try {
    const { name, designation, email, deviceId } = req.body;
    const empFind = await Employee.findOne({ where: { email: email } });
    const deviceIdFound = await Employee.findOne({
      where: { deviceId: deviceId },
    });

    if (!empFind) {
      if (!deviceIdFound) {
        const _employee = new Employee({
          name,
          designation,
          email,
          deviceId,
        });
        await _employee.save();
        return res.status(200).send({
          data: _employee,
          success: true,
        });
      } else {
        return res.status(403).send({
          data: "Employee already exist with that registeration number!",
          success: false,
        });
      }
    } else {
      return res.status(403).send({
        data: "Employee already exist with that email!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findOne({ where: { id: id } });
    if (employee) {
      return res.status(200).send({
        data: employee,
        messgae: "Employee found!",
        success: true,
      });
    } else {
      return res.status(404).send({
        messgae: "Employee not exist!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getAllEmployee = async (req, res, next) => {
  try {
    const allEmployees = await Employee.findAll();
    if (allEmployees) {
      return res.status(200).send({
        data: allEmployees,
        success: true,
      });
    } else {
      return res.status(404).send({
        message: "No employees found!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};
const updateEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, designation, email, deviceId } = req.body;
    const empFind = await Employee.findOne({ where: { id: id } });
    const empFindbyEmail = await Employee.findOne({
      where: { email: email },
    });
    if (empFind) {
      if (!empFindbyEmail) {
        empFind.name = name;
        empFind.designation = designation;
        empFind.email = email;
        empFind.deviceId = deviceId;
        await empFind.save();
        return res.status(200).send({
          data: empFind,
          success: true,
        });
      } else {
        return res.status(403).send({
          message: "Employee already exist with that email or deviceId!",
          success: true,
        });
      }
    } else {
      return res.status(404).send({
        data: "Employee not exist",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  Login,
  addEmployee,
  getEmployee,
  getAllEmployee,
  updateEmployee,
};
