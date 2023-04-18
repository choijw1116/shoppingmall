// const db = require("../config/database");

// export const signupRouter = (req, res) => {
//   const id = req.body.id;
//   const pw = req.body.password;
//   const email = req.body.email;
//   const param = [req.body.id, req.body.email, req.body.password];

//   db.query(
//     `INSERT INTO users(name, email, password) values(${id},${email},${pw})`,
//     param,
//     function (err, result, fields) {
//       if (err) {
//         console.log(err);
//         return res.status(400).json({
//           code: 400,
//           message: "Email is already used.",
//         });
//       }

//       console.log(result);
//       return res.status(200).json({
//         res: result,
//         code: 200,
//         message: "OK",
//       });
//     }
//   );
//   res.end();
// };
