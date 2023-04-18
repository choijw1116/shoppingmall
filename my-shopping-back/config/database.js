require("dotenv").config();
const mysql = require("mysql");
const dbconnect = {
  //mysql접속설정
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbconnect); //DB커넥션 생성
connection.connect((error) => {
  if (err) console.log(error);
  else console.log("DB connect Success");
}); // db접속

// connection.end();

module.exports = connection;
