const jwt = require("jsonwebtoken");
const generateAccessToken = (userId, userEmail, userName) => {
  return jwt.sign(
    { type: "JWT", id: userId, email: userEmail, name: userName },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1m",
      issuer: "jw",
    }
  );
};

const generateRefreshToken = (userId, userEmail, userName) => {
  return jwt.sign(
    { type: "JWT", id: userId, email: userEmail, name: userName },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "180d",
      issuer: "jw refresh",
    }
  );
};

const verifyToken = (token) => {
  let decoded;
  try {
    // verify를 통해 값 decode
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        console.log(err);
      }
    );
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
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
