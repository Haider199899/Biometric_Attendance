const jwt = require('jsonwebtoken');
const zklib=require('zklib');
const {Attendance}=require('../models/attendanceModel')
const attendances = [
  { uid: 0, id: 1, state: 1, timestamp: "2022-05-27T10:03:09.000Z"},
  { uid: 0, id: 1, state: 1, timestamp: '2022-05-27T12:07:10.000Z' },
  { uid: 0, id: 2, state: 1, timestamp: '2022-05-27T12:08:07.000Z' },
  { uid: 0, id: 2, state: 1, timestamp: '2022-05-27T12:10:35.000Z' },
  { uid: 0, id: 2, state: 1, timestamp: '2022-05-27T16:46:32.000Z' },
  { uid: 0, id: 2, state: 1, timestamp: '2022-05-27T16:47:19.000Z' },
  { uid: 0, id: 1, state: 1, timestamp: '2022-05-27T16:53:50.000Z' },
  { uid: 0, id: 3, state: 1, timestamp: '2022-05-27T17:24:11.000Z' },
  { uid: 0, id: 1, state: 1, timestamp: '2022-05-28T10:36:05.000Z' },
  { uid: 0, id: 2, state: 1, timestamp: '2022-05-28T10:57:59.000Z' },
  { uid: 0, id: 2, state: 1, timestamp: '2022-05-28T16:36:10.000Z' },
  { uid: 0, id: 4, state: 1, timestamp: '2022-05-28T16:37:26.000Z' },
  { uid: 0, id: 5, state: 1, timestamp: '2022-05-28T18:03:36.000Z' },
  { uid: 0, id: 4, state: 1, timestamp: '2022-05-28T19:13:50.000Z' },
]
const getAllAttendanceByDate = async (req, res) => {
  try {
    let token = req.headers.token
    let verify = jwt.verify(token, process.env.JWT_SECRET)
    if (verify) {
      zk=new zklib({
        ip:''
      })
      let { date } = req.body
      const datex = JSON.stringify(date)
      date = new Date(datex)
      const result = await attendances.filter(
        (item) =>
          new Date(item.timestamp).toDateString() === date.toDateString(),
      )
      if (result) {
        return res.status(200).send({
          data: result,
          success: true,
        })
      } else {
        return res.status(404).send({
          data: 'Not found!',
          success: false,
        })
      }
    } else {
      return res.status(404).send({
        data: 'You are unauthorized to perform that action!',
        success: false,
      })
    }
  } catch (error) {
    return res.status(404).send({
      data: 'You are unauthorized to perform that action!',
      success: false,
    })
  }
}
const getAttendanceOfUserByDate = async (req, res) => {
  try {
    let token = req.headers.token
    let verify = jwt.verify(token, process.env.JWT_SECRET)
    if (verify) {
      let { id, date } = req.body
      const datex = JSON.stringify(date)

      date = new Date(datex)

      const result = await attendances.filter(
        (item) =>
          new Date(item.timestamp).toDateString() === date.toDateString() &&
          item.id === id,
      )
      if (result) {
        return res.status(200).send({
          data: result,
          success: true,
        })
      } else {
        return res.status(404).send({
          data: 'Not found!',
          success: false,
        })
      }
    } else {
      return res.status(404).send({
        data: 'You are unauthorized to perform that action!',
        success: false,
      })
    }
  } catch (error) {
    return res.status(404).send({
      data: 'You are unauthorized to perform that action!',
      success: false,
    })
  }
}
const geAttendanceByDateRange = async (req, res) => {
  try {
    let token = req.headers.token
    let verify = jwt.verify(token, process.env.JWT_SECRET)
    if (verify) {
      let { fromDate,toDate } = req.body
      const datex = JSON.stringify(fromDate)
      const datey = JSON.stringify(toDate)
      fromDate = new Date(datex)
      toDate = new Date(datey)
      const result = await attendances.filter(
        (item) =>
          new Date(item.timestamp).toDateString() === fromDate.toDateString() &&
          new Date(item.timestamp).toDateString() === toDate.toDateString()
          
      )
      if (result) {
        return res.status(200).send({
          data: result,
          success: true,
        })
      } else {
        return res.status(404).send({
          data: 'Not found!',
          success: false,
        })
      }
    } else {
      return res.status(404).send({
        data: 'You are unauthorized to perform that action!',
        success: false,
      })
    }
  } catch (error) {
    return res.status(404).send({
      data: 'You are unauthorized to perform that action!',
      success: false,
    })
  }
}
const getProHoursOnDate=async(req,res)=>{
    try {
        let token = req.headers.token
        let verify = jwt.verify(token, process.env.JWT_SECRET)
        if (verify) {
          let { id,date } = req.body
          let arr=[]
          date = new Date(date).toDateString()
          console.log(date)
          let result = await attendances.filter((item)=>{
            if(new Date(item.timestamp).toDateString()===date && item.id===id){
                 arr.push(new Date(item.timestamp).getUTCHours())
                 return new Date(item.timestamp).getUTCHours()
                
            }
            
          })
          result=arr;
          console.log(result)
          if (result) {
            return res.status(200).send({
              data: result,
              success: true,
            })
          } else {
            return res.status(404).send({
              data: arr,
              success: false,
            })
          }
        } else {
          return res.status(404).send({
            data: 'You are unauthorized to perform that action!',
            success: false,
          })
        }
      } catch (error) {
        return res.status(404).send({
          data: 'You are unauthorized to perform that action!',
          success: false,
        })
      }
}
const syncDeviceWithDatabase=async(req,res)=>{
  //configuring device
  zk=new zklib({
    ip:process.env.ZK_IP,
    port:process.env.ZK_PORT,
    inport:process.env.ZK_INPORT,
    timeout:process.env.ZK_TIMEOUT

  })
  //making connection with device and extracting all attendance
  zk.connect((err)=>{
    if(err) throw err;
    else{
      zk.getAttendance((err,data)=>{
        if(err) throw err;
        else{
          let { date } = req.body
          const datex = JSON.stringify(date)
          date = new Date(datex)
          const attendanceByDevice = data.filter((item)=>new Date(item.timestamp)>=date);
          
          //saving all attendance to database
          for(let i = 0;i<attendanceByDevice.length;i++){
          var attendance=new Attendance();
          attendance.employeeId=attendanceByDevice[i].id;
          attendance.attendanceTime=attendanceByDevice[i].timestamp;
          attendance.save();
        }
        return res.status(200).send({
          data:attendance,
          success:false
        })
      }
      })
    }
  })  

}
module.exports = {
  getAllAttendanceByDate,
  getAttendanceOfUserByDate,
  geAttendanceByDateRange,
  getProHoursOnDate
}
