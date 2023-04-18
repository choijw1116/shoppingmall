const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv").config("./.env");
const jwt = require("jsonwebtoken");
const path = require("path");
// const loginRouter = require("./routes/login");
// const signupRouter = require("./routes/signup");
const app = express();
// const db = require("./config/database");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("./jwt");
require("dotenv").config();
const mysql = require("mysql");

//!mysql접속설정
const dbconnect = {
  //mysql접속설정
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

//!DB연결
const connection = mysql.createConnection(dbconnect); //DB커넥션 생성
connection.connect((error) => {
  if (error) console.log(error);
  else console.log("DB connect Success");
}); // db접속

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    //클라이언트와 서버간 통신은 쿠키를 사용할것이므로 credential을 true로 설정
    credentials: true,
  })
);

//!회원가입
app.post("/signup", function (req, res) {
  const name = req.body.name;
  const pw = req.body.password;
  const email = req.body.email;

  connection.query(
    `INSERT INTO users(name, email, password) values('${name}','${email}','${pw}')`,
    function (err, result, fields) {
      if (err) {
        // return res.status(400).json({
        //   code: 400,
        //   message: "Please Signup first",
        // });
        return res.send(err);
      }
      return res.send(result);
    }
  );
});

//!로그인
app.post("/login", function (req, res) {
  let isUser = false;
  const userEmail = req.body.email;
  const userPw = req.body.password;

  connection.query(
    `SELECT * FROM users WHERE email = '${userEmail}' AND password = '${userPw}'`,
    function (err, result, fields) {
      // console.log("result", result[0].id, "isUser", isUser);
      if (err || result.length === 0) {
        return res.status(400).json({
          code: 400,
          message: "Please Signup first",
        });
      } else {
        result.forEach((info) => {
          if (info.email === userEmail && info.password === userPw) {
            isUser = true;
          } else {
            return res.status(403).json("Not Authorized");
          }
        });
        if (isUser) {
          const id = result[0].id;
          const userName = result[0].name;
          const accessToken = generateAccessToken(id, userEmail, userName);
          const refreshToken = generateRefreshToken(id, userEmail, userName);

          return res.status(200).json({
            result: "Login Success",
            isLogin: true,
            accessToken,
            refreshToken,
          });
        } else {
          res.status(400).json({
            result: "invalid user",
            error: "invalid user",
            isLogin: false,
          });
        }
      }
    }
  );
});

//!토큰재발급
//!accesstoken만료시 리프레쉬토큰으로 확인후 토큰두개 같이재발급
//!수정필요(2/9)
app.post("/refresh", (req, res) => {
  try {
    console.log(req);
    const refresh = req.cookies.refreshToken;

    // verify를 통해 값 decode
    const decoded = verifyToken(refresh);
    // 새로운 accessToken, refreshToken발급
    accessToken = generateAccessToken(
      decoded.userId,
      decoded.userEmail,
      decoded.userName
    );
    refreshToken = generateRefreshToken(
      decoded.userId,
      decoded.userEmail,
      decoded.userName
    );

    res.status(200).json("Recreated access token", accessToken, refreshToken);
  } catch (err) {
    if (err.message === "jwt expired") {
      console.log("expired token");
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다",
      });
    } else {
      return res.status(401).json({
        code: 401,
        message: "유효하지 않은 토큰입니다",
      });
    }
  }
});

//!전체상품조회
app.get("/product", verifyToken, function (req, res) {
  const id = req.body.id;

  connection.query(`SELECT * FROM product`, function (err, result, fields) {
    try {
      return res.status(200).json({
        result: "Get All Products Success",
      });
    } catch (err) {
      return res.status(400).json({
        result: "Error",
        error: "Cannot get products",
      });
    }
  });
});

// app.get("/accesstoken", function (req, res) {
//   try {
//     const token = req.cookies.accessToken;
//     const data = verifyToken(token);

//     const userData = userDatabase.filter((item) => {
//       return item.email === data.email;
//     })[0];

//     const { password, ...others } = userData;

//     res.status(200).json(others);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

app.listen(8000, () => {
  console.log(`Example app listening on port`);
});
