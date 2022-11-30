const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {Employee}=require('../models/employee.model')
dotenv.config({ path: require('find-config')('.env') })
const Login = (req, res) => {
  let { email, password } = req.body
  if (email === 'abakar@techrivers.com') {
    if (password === 'abakar@@hr007') {
      //signing JWT Token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: 86400,
      })
      return res.status(200).send({
        message: 'Login successfull',
        success: true,
        accessToken: token,
      })
    } else {
      return res.status(401).send({
        message: 'Email or password is incorrect!',
        success: false,
      })
    }
  } else {
    return res.status(404).send({
      message: 'Email or password is incorrect!',
      success: false,
    })
  }
}
const addEmployee=async (req,res)=>{
  try {
    let token = req.headers.token
    let verify = jwt.verify(token, process.env.JWT_SECRET)
    if (verify) {
      let { name,designation,email,deviceId } = req.body
      const empFind = await Employee.findOne({ where: { email: email } });
      const deviceIdFound=await Employee.findOne({ where: { deviceId:deviceId } })
     
      if(!(empFind)){
         if(!(deviceIdFound)){
      const _employee = new Employee({
        name,
        designation,
        email,
        deviceId
        
      });
      await _employee.save()
        return res.status(200).send({
          data: _employee,
          success:true
        })
      }else{
        return res.status(404).send({
          data: 'Employee already exist with that registeration number!',
          success: false,
        })
        }
      }
       else {
        return res.status(404).send({
          data: 'Employee already exist with that email!',
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
const getEmployee=async(req,res)=>{
  try{
  let token=req.headers.token;
  const verify=jwt.verify(token,process.env.JWT_SECRET);
  if(verify){
        const {email}=req.body
        const employee=await Employee.findOne({email});
        if(employee){
          return res.status(200).send({
            data:employee,
            messgae:"Employee found!",
            success:true
          })
        }else{
          return res.status(200).send({
            messgae:"Employee not exist!",
            success:false
          })
        }
  }else{
    return res.status(400).send({
      message:"You are not authorized to perform that action!",
      success:false
    })
  }
  }catch(error){
    return res.status(400).send({
      message:'You cant perform that action due to '+error,
      success:false
    })
  }
}
const getAllEmployee=async(req,res)=>{
  try{
  const token=req.headers.token;
  const verify=jwt.verify(token,process.env.JWT_SECRET);
  if(verify){
    const allEmployees=await Employee.findAll();
    if(allEmployees){
      return res.status(200).send({
        data: allEmployees,
        success: true,
      })
    }else{
      return res.status(404).send({
        message: 'No employees found!',
        success: false,
      })
    }
  }else{
    return res.status(404).send({
      message: 'You are unauthorized to perform that action!',
      success: false,
    })
  }
}
  catch(error){
    return res.status(404).send({
      message: 'You are unauthorized to perform that action!'+error,
      success: false,
    })
  }
}
const updateEmployee=async(req,res)=>{
  try {
    let token = req.headers.token
    let verify = jwt.verify(token, process.env.JWT_SECRET)

    if (verify) {
      let id=req.params.id
      let { name,designation,email,deviceId } = req.body
      const empFind = await Employee.findOne({ where: { id: id } });
      console.log(empFind)
      if((empFind)){
         empFind.name=name;
         empFind.designation=designation;
         empFind.email=email;
         empFind.deviceId=deviceId;
         await empFind.save()
        return res.status(200).send({
          data: empFind,
          success:true
        })
      }else{
        return res.status(404).send({
          data: 'Employee not exist',
          success: false,
        })
        }
      }
     
     else {
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

module.exports = {
  Login,
  addEmployee,
  getEmployee,
  getAllEmployee,
  updateEmployee
}