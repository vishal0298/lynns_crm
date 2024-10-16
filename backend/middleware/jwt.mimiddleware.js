const jwt = require("jsonwebtoken");
var response = require("../response");

module.exports.jwtauth = function (req, res, next) {
  if (
    req.headers &&
    req.headers.token &&
    req.headers.token != "" &&
    req.headers.token != undefined
  ) {
    jwt.verify(
      req.headers.token,
      process.env.JWTSECRET,
      function (err, decoded) {
        if (err) {
          response.unauthorized_error_message(
            { message: "Middleware : " + err.message },
            res
          );
        } else {
          req.user_id = decoded.id;
          next();
        }
      }
    );
  } else {
    response.unauthorized_error_message({ message: "Token Not Found" }, res);
  }
};
