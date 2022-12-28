const zklib = require("zklib");
const dotenv = require("dotenv");
const { Employee } = require("../models/employee.model");
const { Attendance } = require("../models/attendanceModel");
dotenv.config({ path: ".env" });
const State = {
  CHECK_IN: 'checkin',
  CHECK_OUT: 'checkout'
}

checkInDevice = new zklib({
  ip: process.env.IP_CHECK_IN,
  port: process.env.ZK_PORT,
  inport: process.env.ZK_CHECKIN
});

checkOutDevice = new zklib({
  ip: process.env.IP_CHECK_OUT,
  port: process.env.ZK_PORT,
  inport: process.env.ZK_CHECKOUT
});




const checkInAttendanceData = () =>
  new Promise((resolve, reject) => {
    checkInDevice.connect((err) => {

      if (err) reject(err);
      else {

        checkInDevice.enableDevice((err) => {
          if (err) throw err;
          checkInDevice.getAttendance((err, data) => {
            if (err) reject(err);
            else {
              resolve(data)
              checkInDevice.disconnect()
            }
          });
        });
      }
    });
  });

const checkOutAttendanceData = () =>
  new Promise((resolve, reject) => {
    checkOutDevice.connect((err) => {

      if (err) {
        reject(err)
      }
      else {

        checkOutDevice.enableDevice((err) => {
          if (err) throw err;
          checkOutDevice.getAttendance((err, data) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(data);
              checkOutDevice.disconnect();
            }
          });
        });
      }
    });
  });

const syncWithDatabase = async (req, res, next) => {
  try {
    const checkInData = await checkInAttendanceData();
    console.log(checkInData)
    const checkOutData = await checkOutAttendanceData();

    let count = 0;
    
    for (let i = 0; i < checkInData.length; i++) {
      //check does employee exist in database
      const employee = await Employee.findOne({
        where: { deviceId: checkInData[i].id },
      });

      if (employee !== null) {
        //To check that attendance exist in database
        const attendanceExist = await Attendance.findOne({
          where: {
            attendanceTime: checkInData[i].timestamp,
            employeeId: employee.id,
          },
        });
        //If both condition satisfies
        if (attendanceExist !== null) {
          continue;
        } else {
          const attendance = new Attendance();

          attendance.attendanceTime = checkInData[i].timestamp;
          attendance.state = State.CHECK_IN;
          attendance.employeeId = employee.id;
          attendance.save();
          count++;
        }
      } else {
        continue;
      }
    }
    for (let i = 0; i < checkOutData.length; i++) {
      //check does employee exist in database
      const employee = await Employee.findOne({
        where: { deviceId: checkOutData[i].id },
      });

      if (employee) {
        //To check that attendance exist in database
        const attendanceExist = await Attendance.findOne({
          where: {
            attendanceTime: checkOutData[i].timestamp,
            employeeId: employee.id,
          },
        });
        //If both condition satisfies
        if (attendanceExist) {
          continue;
        } else {
          const attendance = new Attendance();
          attendance.attendanceTime = checkOutData[i].timestamp;
          attendance.state = State.CHECK_OUT;
          attendance.employeeId = employee.id;
          attendance.save();
          count++;
        }
      } else {
        continue;
      }
    }
    if (count === 0) {
      return res.status(200).send({
        message: "No new record found!",
        success: false,
      });
    } else {
   
      return res.status(200).send({
        message: count + "record inserted!",
        success: false,
      });
    }
  } catch (error) {

    next(error)
  }

}


module.exports = {
  syncWithDatabase
};
