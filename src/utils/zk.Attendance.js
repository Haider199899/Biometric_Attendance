const zklib = require('zklib')
const dotenv = require('dotenv')
const { Employee } = require('../models/employee.model')
const { Attendance } = require('../models/attendanceModel')
dotenv.config({ path: '.env' })
console.log(process.env.ZK_IP)
zk = new zklib({
    ip: process.env.ZK_IP,
    port: process.env.ZK_PORT,
    inport: process.env.ZK_INPORT,
    timeout: process.env.ZK_TIMEOUT,
})
let attendanceData = new Promise((resolve, reject) => {
    zk.connect((err) => {
        if (err) reject(err)
        else {
            zk.getAttendance((err, data) => {
                if (err) reject(err)
                else {
                    resolve(data)
                }
            })
        }
    })
})
const syncWithDatabase = async (req,res) => {
    try {
        let data = await attendanceData
        console.log(data)
        let count=0
        for (let i = 0; i < data.length; i++) {
            //check does employee exist in database
            const findEmployee = await Employee.findOne({
                where: { deviceId: data[i].id },
            })

            if (findEmployee) {
                //To check that attendance exist in database
                const attendanceExist = await Attendance.findOne({
                    where: { attendanceTime: data[i].timestamp, employeeId: data[i].deviceId },
                })
                //If both condition satisfies
                if (attendanceExist) {
                    continue;
                } else {
                    const attendance = new Attendance()
                    attendance.attendanceTime = data[i].timestamp
                    attendance.employeeId = data[i].deviceId
                    attendance.save()
                    count++
                    
                }
            } else {
                continue;
            }
        }
        if(count===0){
            return res.status(200).send({
                message:'No new record found!',
                success:false
            })
        }else{
            return res.status(200).send({
                message:count +'record inserted!',
                success:false
            })
        }
    } catch (error) {
        return res.status(400).send({
            message:'Operation unsuccessful due to '+error
        })
    }
}
module.exports = {
     syncWithDatabase
}