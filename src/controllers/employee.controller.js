const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const sqlite3 = require('sqlite3');
const sgMail = require('@sendgrid/mail');

const { Employee } = require("../models/employee.model");
const db = new sqlite3.Database('passwords.db', sqlite3.OPEN_READWRITE, (err) => {
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
            return res.status(403).send({
              message: "Email or password is incorrect",
              success: true
            });
          }
        })





      })
    })



  } catch (error) {
    next(error);
  }
};
//================================================================= Recover Password ===============================================================================//

//Generates token and Sends password reset email
const sendRequest = async (req, res, next) => {
  try {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const email = req.query.email;
    const token = jwt.sign({ email }, process.env.JWT_SECRET_RESET_PASS, { expiresIn: process.env.JWT_EXPIRATION_TIME_PASS_RECOVER })

    let link = "http://" + process.env.HOST + ":" + process.env.PORT + "/auth/verify/" + token;
    const mailOptions = {
      to: process.env.TO_RESET_EMAIL,
      from: email,
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

  } catch (error) {
    next(error)
  }
}
//Verify link and redirect to reset password page
const verifyRequest = async (req, res, next) => {
  try {
    const token = req.params.token;
    //To check that token expires
    const verify = jwt.verify(token, process.env.JWT_SECRET_RESET_PASS, (err, decode) => {
      if (err) {
        next(err)
      } else {
        req.user = decode
        return res.redirect('/auth/reset')
      }
    });
  }
  catch (error) {
    next(error)
  }
}
const resetPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body
  db.serialize(() => {
    db.all(`SELECT * FROM pass WHERE id = 1`, (err, rows) => {
      rows.forEach((row) => {
        if (row.password === oldPassword) {
          db.serialize(() => {
            db.run(`UPDATE pass SET password = ? WHERE id = 1`, [newPassword], (err) => {

              if (err) {

                next(err)
                console.log(err)

              }

              return res.status(200).send({
                message: "Password is updated successfully",
                success: true
              });
            })

          })
        } else {
          return res.status(403).send({
            message: "Incorrect old Password!",
            success: false
          });
        }
      })
    })
  })



}
//================================================================== Employee CRUD Operations ==================================================================================//

const addEmployee = async (req, res, next) => {
  try {

    const { name, designation, email, deviceId } = req.body;
    const decodedToken = jwt.decode(req.headers['x-access-token'])
    const updatedBy = decodedToken.email
    const _employee = new Employee({
      name,
      designation,
      email,
      deviceId,
      updatedBy
    });
    await _employee.save();
    return res.status(200).send({
      data: _employee,
      success: true,
    });

  } catch (error) {
    next(error);
  }
};
const getEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findOne({ where: { id: id } });
    if (employee === null) {
      return res.status(404).send({
        message: "Employee not found!",
        success: false,
      });
    }
    else {

      return res.status(200).send({
        data: employee,
        messgae: "Employee found!",
        success: true,
      });

    }

  } catch (error) {
    next(error);
  }
};
const getAllEmployee = async (req, res, next) => {
  try {
    const allEmployees = await Employee.findAll();

    if (allEmployees.length != 0) {
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
    const { name, designation, email} = req.body;

    const decodedToken = jwt.decode(req.body.token || req.query.token || req.headers["x-access-token"])
    const updatedBy = decodedToken.email
    const employee = await Employee.findOne({ where: { id: id } });
    if (employee === null) {
      return res.status(404).send({
        message: "Employee not found!",
        success: false,
      });
    }

    else {
    

        employee.name = name;
        employee.designation = designation;
        employee.email = email;
        employee.updatedBy = updatedBy
        await employee.save();
        return res.status(200).send({
          message: 'Employee record Updated!',
          success: true,
        });
       

    }
  } catch (error) {

    next(error);
  }
};
const deleteEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const decodedToken = jwt.decode(req.body.token || req.query.token || req.headers["x-access-token"])
    const updatedBy = decodedToken.email
    const employee = await Employee.findOne({ where: { id: id } });
    if (employee === null) {
      return res.status(404).send({
        message: "Employee not found!",
        success: false,
      });
    } else {

      await Employee.destroy({
        where: {
          id: id
        }
      });
      employee.dataValues.updatedBy = updatedBy
      return res.status(200).send({
        message: "Employee deleted Successfully!",
        success: false,
      });
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  Login,
  sendRequest,
  verifyRequest,
  resetPassword,
  addEmployee,
  getEmployee,
  getAllEmployee,
  updateEmployee,
  deleteEmployee
};
