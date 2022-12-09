const express = require("express");
const dotenv = require("dotenv");
const { sequelize } = require("./config/db_connect_config");
const employeeRouter = require("./routes/employee.routes");
const attendanceRouter = require("./routes/attendance.routes");
const {createDbForLoginPasswords} = require('./config/sqliteDb')
const { ErrorHandler } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT;

dotenv.config({ path: ".env" });
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Database configuration
const connect = async () => {
  try {
    await sequelize.authenticate();
    //sequelize.sync({ force: true });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connect();
//createDbForLoginPasswords();         
app.use(employeeRouter);
app.use(attendanceRouter);
app.use(ErrorHandler);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Biometric Attendance application." });
});

//  listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
