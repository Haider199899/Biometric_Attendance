const zklib = require("zklib");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
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
 
const get = async()=>{
    console.log(await checkInAttendanceData())
    console.log(await checkOutAttendanceData())
}
get()