const jwt = require('jsonwebtoken');
const zklib=require('zklib');
const dotenv=require('dotenv');
const queryString=require('query-string')
const {Attendance}=require('../models/attendanceModel')
const {attendanceData}=require('../utils/zk.Attendance')
dotenv.config({path:'.env'})

const getAllAttendanceByDate = async (req, res) => {
  try {
    let token = req.headers.token
    let verify = jwt.verify(token, process.env.JWT_SECRET)
    if (verify) {

      let date  = req.query.date
      const datex = JSON.stringify(date)
      date = new Date(datex)
      let data=await attendanceData
      const result = await data.filter(
        (item) =>{
          if(item.timestamp.toLocaleDateString() === date.toLocaleDateString()){
            item.timestamp=item.timestamp.toLocaleString()
            console.log(item)
            return item
          }
        }

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
      data: 'You are unauthorized to perform that action!'+error,
      success: false,
    })
  }
}
const getAttendanceOfUserByDate = async (req, res) => {
  try {
    let token = req.headers.token
    let verify = jwt.verify(token, process.env.JWT_SECRET)
    if (verify) {

      let id=req.query.id;
      let date=req.query.date;
      const datex = JSON.stringify(date)
      date = new Date(datex)
      let data=await attendanceData
      const result = await data.filter(
        (item) =>{
          if((item.timestamp.toLocaleDateString() === date.toLocaleDateString())&& (item.id === parseInt(id))){
            item.timestamp=item.timestamp.toLocaleString()
            return item
          }
        }

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
      data: 'You are unauthorized to perform that action!'+error,
      success: false,
    })
  }
}
const geAttendanceByDateRange = async (req, res) => {
  try {
    let token = req.headers.token
    let verify = jwt.verify(token, process.env.JWT_SECRET)
    if (verify) {
      let fromDate = req.query.fromDate;
      let toDate   =   req.query.toDate;
      fromDate = new Date(fromDate)
      toDate = new Date(toDate)
      fromDate=fromDate.setDate(fromDate.getDate())
      toDate=toDate.setDate(toDate.getDate()+1)
      let data=await attendanceData
      const result = await data.filter(
        (item) =>{
          if  ((new Date(item?.timestamp).getTime() >= fromDate) && (new Date(item?.timestamp).getTime() <= toDate))
          {
            item.timestamp=item.timestamp.toLocaleString()
            return item
          }
        }
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
      data: 'You are unauthorized to perform that action!'+error,
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
          let data=await attendanceData
          let result = await data.filter((item)=>{
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

module.exports = {
  getAllAttendanceByDate,
  getAttendanceOfUserByDate,
  geAttendanceByDateRange,
  getProHoursOnDate
}
