var nodemailer = require("nodemailer");

var config = {
  user: "nithya.t@dreamguys.co.in",
  password: "dreamguys",
  host: "smtp.gmail.com",
  ssl: true,
  from_address: "nithya.t@dreamguys.co.in",
  from_name: "Kanakku",
  port: 465,
};

transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tamilarasan.murugan@dreamguystech.com",
    pass: "apcatxulrlezycgc",
  },
  debug: false,
});

module.exports = { config, transporter };
