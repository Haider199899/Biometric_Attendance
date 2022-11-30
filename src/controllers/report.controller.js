const {attendanceData}=require('../utils/zk.Attendance');
const fs=require('fs');
const cronJob=require('node-cron');
const csvWriter=require('csv-writer');
let createCsvWriter = csvWriter.createObjectCsvWriter;
const getCsv = function (data) {

    const csvRows = [];

    /* Get headers as every csv data format
    has header (head means column name)
    so objects key is nothing but column name
    for csv data using Object.key() function.
    We fetch key of object as column name for
    csv */
    const headers = Object.keys(data[0]);

    /* Using push() method we push fetched
       data into csvRows[] array */
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
       to this function.*/
    return csvRows.join('\n');
};
const weeklyReport = async(req,res)=>{
    try {
        const data = await attendanceData;
        const endDate = new Date();//current date
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7)
        //getting all attendance of last week
        const weeklyData = data.filter((item) => item.timestamp > startDate && item.timestamp < endDate);
        //getting csv format
        const csvData = getCsv(weeklyData)
        const path = 'sample.csv';
        const csvWriter = createCsvWriter({
            path: path,
            header: [{ id:'Uid',title:'UID'},{id:'id',title:'UserId' },{id:'state',title:'State'},{id:'timestamp',title:'timestamp'}]
        });

        if(weeklyData.length!=0) {
            csvWriter.writeRecords(weeklyData)
                .then(() => {
                    res.download(path);
                });

        }

        else{
            return res.status(200).send({
                message:'Data not found!',
                success:false
            })
        }
    }catch(error){
        return res.status(400).send({
            message:'Operation did not successful due to '+error,
            success:false
        })
    }
}
module.exports={
    weeklyReport
}