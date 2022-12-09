const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const sqlite3 = require('sqlite3');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { Employee } = require("../models/employee.model");
const db = new sqlite3.Database('passwords.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Connected to the passwords database.');
}

);

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    db.serialize(() => {
      db.all(`SELECT * FROM pass WHERE id = 1`, (err, rows) => {

        if (err) {

          next(err)

        }
        rows.forEach((row) => {

          if (row.email === email && row.password === password) {

            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRATION_TIME,
            });
            return res.status(200).send({
              message: "Login successfull",
              success: true,
              accessToken: token,
            });
          } else {
            return res.status(404).send({
              message: "Email or password is incorrect",
              success: false
            });
          }
        })





      })
    })



  } catch (error) {
    next(error);
  }
};
//Recover Password - Generates token and Sends password reset email
const recoverPassword = async (req, res, next) => {
  try {
    const email = req.query.email;
    if (email === process.env.TO_RESET_EMAIL) {

      const token = jwt.sign({ email }, process.env.JWT_SECRET_RESET_PASS, { expiresIn: process.env.JWT_EXPIRATION_TIME_PASS_RECOVER })

      let link = "http://" + process.env.HOST + ":" + process.env.PORT + "/auth/reset/" + token;
      const mailOptions = {
        to: process.env.TO_RESET_EMAIL,
        from: process.env.FROM_RESET_EMAIL,
        subject: "Password change request",
        text: `Hi \n 
    Please click on the following link ${link} to reset Biometric Attendance System password. \n\n 
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
      sgMail.send(mailOptions, (error, result) => {
        if (error) {
          next(error)
        }


        res.status(200).json({ message: 'A reset email has been sent to ' + process.env.TO_RESET_EMAIL + '.' });
      });




    } else {
      return res.status(400).send({
        message: "Email is invalid!",
        success: false
      })
    }
  } catch (error) {
    next(error)
  }
}
//Verify link and redirect to reset password page
const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    //To check that token expires
    const verify = jwt.verify(token, process.env.JWT_SECRET_RESET_PASS, (err, decode) => {
      if (err) {
        next(err)
      } else {
        req.user = decode
        return res.redirect('/auth/changePass')
      }
    });
  }
  catch (error) {
    next(error)
  }
}
const changePass = async (req, res, next) => {
      
}

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
  recoverPassword,
  resetPassword,
  addEmployee,
  getEmployee,
  getAllEmployee,
  updateEmployee,
};
