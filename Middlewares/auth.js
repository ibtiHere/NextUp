const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  console.log("auth wala run ??????????????????????????????");
  try {
    let token = req.headers.authorization;
    console.log("token ====>", token);
    if (token) {
      token = token.split(" ")[1];
      const user = jwt.verify(token, process.env.SCRATEKEY);
      console.log("user ====> ", user);
      if (user) {
        // console.log("user in auth =====>", user);
        // req.userId = user.id;
        req.user = user;
      }
    } else {
      //   console.log("errorrrrr");
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    next();
  } catch (err) {
    console.log("err:", err);
    return res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports = auth;
