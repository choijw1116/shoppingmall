// 'express'에서 제공해주는 router를 이용해 route(길)을 연결
//라우터는 클라이언트의 요청 경로(path)를 보고 이 요청을 처리할 수 있는 곳으로 기능을 전달해주는 역할을 한다. 이러한 역할을 라우팅이라고 하는데, 애플리케이션 엔드 포인트 (URI)의 정의, 그리고 URI가 클라이언트 요청에 응답하는 방식을 의미한다. 예를 들어, 클라이언트가 /users 경로로 요청을 보낸다면 이에 대한 응답 처리를 하는 함수를 별도로 분리해서 만든 다음 get()메소드를 호출하여 라우터로 등록할 수 있다.

import connection from "../config/database";

const db = require("../config/database");
const { generateAccessToken, generateRefreshToken } = require("../jwt");

export const loginRouter = (req, res, next) => {
  console.log(req.body);
  const id = req.body.id;
  const param = [req.body.email, req.body.password];
  let accessToken = generateAccessToken(id);
  let refreshToken = generateRefreshToken(id);
  connection.query(`SELECT email FROM users`, param, function (err, result, fields) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        code: 400,
        message: "Please Signup first",
      });
    }

    console.log(result);
    const token = accessToken;
    res.cookie(token);
    return res.status(200).json({
      res: result,
      code: 200,
      message: "OK",
      token,
    });
  });
  res.end();
};
