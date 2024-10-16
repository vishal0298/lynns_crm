const jwt = require("jsonwebtoken");
module.exports.verify_token = function (token) {
  var status;
  jwt.verify(token, process.env.JWTSECRET, function (err, decoded) {
    if (err) {
      status = { status: 404, error: err.message };
    } else {
      status = { status: 200, details: decoded };
    }
  });
  return status;
};
