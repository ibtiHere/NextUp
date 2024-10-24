const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      const user = jwt.verify(token, process.env.SCRATEKEY);
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
