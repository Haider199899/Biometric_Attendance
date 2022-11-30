//const {attendanceData}=require('./src/utils/zk.Attendance')
//const nodeCron=require('node-cron')
/*const getData=async()=>{
    let x=await attendanceData
    console.log(x)
}
const job=nodeCron.schedule('* * * * * *',()=>{
    console.log('task')
})
job.start()
const date=new Date();
console.log(date.getFullYear(),date.getMonth(),date.getDate()-1)
const lastWeekDate=new Date(date.getFullYear(),date.getMonth(),date.getDate()-7)
console.log(lastWeekDate)
const objectToCsv = function (data) {

    const csvRows = [];

     Get headers as every csv data format
    has header (head means column name)
    so objects key is nothing but column name
    for csv data using Object.key() function.
    We fetch key of object as column name for
    csv
    const headers = Object.keys(data[0]);

    Using push() method we push fetched
       data into csvRows[] array
    csvRows.push(headers.join(','));

    // Loop to get value of each object key
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header]
            return `"${val}"`;
        });

        // To add, sepearater between each value
        csvRows.push(values.join(','));
    }

    /* To add new line for each object values
       and this return statement array csvRows
       to this function.
    return csvRows.join('\n');
};


const data = [{
    "firstname": "geeks",
    "lastname": "org",
    "age": 12
},
    {
        "firstname": "devendra",
        "lastname": "salunke",
        "age": 31
    },
    {
        "firstname": "virat",
        "lastname": "kohli",
        "age": 34
    },
];
console.log(objectToCsv(data).length)

const {attendanceData} =require("./src/utils/zk.Attendance");
const att=async()=> {
    const data = await attendanceData
    console.log(data)
    const date="2022-11-29"
   // console.log(new Date(date))
    //console.log(data[-1].timestamp)
   // const result=data.filter((item)=>{
     //   console.log(new Date(item.timestamp).toLocaleDateString())
    //    new Date(item.timestamp).toLocaleTimeString()===new Date().toLocaleTimeString()})
 //   console.log(result)
}
att()
*/
const d=new Date().toDateString()
console.log(d)
console.log(new Date(d))
console.log('11/3/2022'>='11/22/2022')
console.log('11/30/2022')
let x='2022-11-30'
console.log(new Date(x).toDateString())