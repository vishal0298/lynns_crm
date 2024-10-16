const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");
const response = require("../../../response");
const bcrypt = require("bcryptjs");
const crypto = require("../../../crypto");
const mailerConfig = require("../../../config/mailConfig");
const preference_settingsModels = require("../../preference_settings/models/preference_settings.models");
const companySettingModel = require("../../companySettings/models/companySetting.model");
const permissionModel = require("../../permissions/models/permission.model");
const verify = require("../../../verify.token");
const notification = require("../../notification/controllers/notification.controller");
const notificationModel = require("../../notification/models/notification.model");
const emailSettingModel = require("../../email_settings/models/email_settings.model");
const mailSend = require("../../common/mailSend");
const { createTransporters } = require("../../common/mailSend");

var data;

exports.signup = async (req, res) => {
  try {
    const user = await authModel.findOne({ email: req.body.email });
    if (user) {
      data = { message: "User with that email already exists." };
      response.validation_error_message(data, res);
    } else {
      const hashedPassword = bcrypt.hashSync(req.body.password, 8);
      const newUser = await authModel.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashedPassword,
        role: "Super Admin",
        created_at: new Date().toISOString(),
      });
      data = { message: "Registration successful.", auth: true };
      response.success_message(data, res);
    }
  } catch (err) {
    data = { message: err.message };
    response.error_message(data, res);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await authModel.findOne({ email: req.body.email });
    if (!user) {
      data = { message: "Email is incorrect." };
      response.validation_error_message(data, res);
    } else if (user.status === "Inactive") {
      data = { message: "User is inactive." };
      response.validation_error_message(data, res);
    } else {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        data = { message: "Password is incorrect." };
        response.validation_error_message(data, res);
      } else {
        let permissionRec, currencySymbol, profileDetails, companyDetails;
        const token = jwt.sign(
          {
            id: user._id,
            role: user.role,
            email: req.body.email,
            password: req.body.password,
          },
          process.env.JWTSECRET,
          {
            expiresIn: "24h", // expires in 24 hours
          }
        );
        console.log(token)
        if (req.body.fcmToken) {
          await authModel.findByIdAndUpdate(
            user._id,
            {
              $set: {
                fcmToken: req.body.fcmToken,
              },
            },
            { new: true }
          );
        }

        permissionRec = { allModules: true };
        if (user.role !== "Super Admin") {
          permissionRec = await permissionModel
            .findOne({
              roleName: user.role,
            })
            .lean();
        }
        const preferenceRec = await preference_settingsModels
          .findOne()
          .populate("currencyId")
          .lean();
        if (preferenceRec && preferenceRec.currencyId) {
          currencySymbol = preferenceRec.currencyId.currency_symbol;
        } else {
          currencySymbol = "";
        }

        profileDetails = await authModel
          .findOne({ _id: user._id })
          .select("firstName lastName gender image")
          .lean();

        if (profileDetails == null) {
          profileDetails = {
            firstName: "",
            lastName: "",
            gender: "",
            image: "",
          };
        }

        companyDetails = await companySettingModel.findOne().lean();

        if (companyDetails == null) {
          companyDetails = {
            companyName: "",
            email: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            siteLogo: "",
            favicon: "",
            companyLogo: "",
          };
        }
        data = {
          profileDetails: profileDetails,
          companyDetails: companyDetails,
          currencySymbol: currencySymbol,
          token: token,
          permissionRes: permissionRec,
        };
        req.headers.token = token;
        if (companyDetails.siteLogo !== "") {
          companyDetails.siteLogo = `${process.env.DEVLOPMENT_BACKEND_URL}/${companyDetails.siteLogo}`;
        }
        if (companyDetails.favicon !== "") {
          companyDetails.favicon = `${process.env.DEVLOPMENT_BACKEND_URL}/${companyDetails.favicon}`;
        }
        if (companyDetails.companyLogo !== "") {
          companyDetails.companyLogo = `${process.env.DEVLOPMENT_BACKEND_URL}/${companyDetails.companyLogo}`;
        }
        if (profileDetails.image !== "") {
          profileDetails.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${profileDetails.image}`;
        }

        await notificationModel.deleteMany({
          userId: user._id,
        });
        await notification.minStockAlert(req, res);
        response.success_message(data, res);
      }
    }
  } catch (err) {
    data = { message: err.message };
    response.error_message(data, res);
  }
}; 

exports.forgot_password = async (req, res) => {
  authModel.findOne({ email: req.body.email }, async function (err, user) {
    if (err) {
      data = { message: err.message };
      response.error_message(data, res);
    } else {
      if (user) {
        const passwordResetUrlData = `${req.body.email}`;
        var enc_data = crypto.encrypt(passwordResetUrlData);
        var subject = "Password Reset Link";
        const passwordreset_link =
          process.env.DEVLOPMENT_FRONTEND_URL +
          "/confirmation-password?content=" +
          enc_data.content +
          "&iv=" +
          enc_data.iv;
        var html = "";
        html +=
          '<a href="' +
          passwordreset_link +
          '">Click Here To Change Your Password...</a>';
        html += "<p><b>This Link Expired with in 1 Hours...</b></p>";

        const emailSettings = await emailSettingModel.findOne().lean();

        let mailres;
        //emailSettings Null Start
        if(emailSettings!=null){
          const transporters = await createTransporters();
          const nodeTransporter = transporters.nodeTransporter;
          const smtpTransporter = transporters.smtpTransporter;
  
        if (emailSettings.provider_type === "NODE") {
          mailres = await nodeTransporter.sendMail(
            {
              from: `${emailSettings.nodeFromName} <${emailSettings.nodeFromEmail}>`,
              to: req.body.email,
              subject: subject,
              html: html,
            },
            function (err, mailres) {
              if (err) {
                response.validation_error_message(
                  { message: "Failed to sent" },
                  res
                );
              } else {
                var milliseconds = new Date().getTime() + 1 * 60 * 60 * 1000;
                var threehours = new Date(milliseconds);

                authModel.findByIdAndUpdate(
                  { _id: user._id },
                  { pswd_reset_at: threehours },
                  function (err, users) {
                    if (err) {
                      data = { message: err.message };
                      response.validation_error_message(data, res);
                    } else {
                      // if (users) sfsd = sdfd;
                    }
                  }
                );

                if (mailres) {
                  console.log("mailres :", mailres);
                  response.success_message(
                    { message: "Mail sent successfully!" },
                    res
                  );
                }
              }
            }
          );
        } else {
          mailres = await smtpTransporter.sendMail(
            {
              from: `${emailSettings.smtpFromName} <${emailSettings.smtpFromEmail}>`,
              to: req.body.email,
              subject: subject,
              html: html,
            },
            function (err, mailres) {
              if (err) {
                response.validation_error_message(
                  { message: "Failed to sent" },
                  res
                );
              } else {
                var milliseconds = new Date().getTime() + 1 * 60 * 60 * 1000;
                var threehours = new Date(milliseconds);

                authModel.findByIdAndUpdate(
                  { _id: user._id },
                  { pswd_reset_at: threehours },
                  function (err, users) {
                    if (err) {
                      data = { message: err.message };
                      response.validation_error_message(data, res);
                    } else {
                      // if (users) sfsd = sdfd;
                    }
                  }
                );

                if (mailres) {
                  response.success_message(
                    { message: "Mail sent successfully!" },
                    res
                  );
                }
              }
            }
          );
        }
      }else{
        data = { message: "From email is empty!" };
        response.validation_error_message(data, res);
  
      }
      //emailSettings Null end

      } else {
        data = { message: "Invalid Email" };
        response.validation_error_message(data, res);
      }
    }
  });
};

exports.reset_password = async function (req, res) {
  var dc_data = crypto.decrypt({ iv: req.body.iv, content: req.body.content });

  if (dc_data) {
    dcryptedData = dc_data.split("&");

    if (dcryptedData.length > 0 && dcryptedData[0] != "") {
      authModel.findOne({ email: dcryptedData[0] }, function (err, user) {
        if (err) {
          data = { message: err.message };
          response.error_message(data, res);
        } else {
          if (user) {
            if (user.pswd_reset_at > new Date()) {
              var newvalues = {
                $set: {
                  password: bcrypt.hashSync(req.body.new_password),
                },
              };

              authModel.findByIdAndUpdate(
                { _id: user._id },
                newvalues,
                function (err, users) {
                  if (err) {
                    data = { message: err._message };
                    response.validation_error_message(data, res);
                  } else {
                    if (users) {
                      data = { message: "Password Reset successfully." };
                      response.success_message(data, res);
                    }
                  }
                }
              );
            } else {
              data = { message: "your Link has expired..." };
              response.validation_error_message(data, res);
            }
          } else {
            data = { message: "invalid User" };
            response.validation_error_message(data, res);
          }
        }
      });
    } else {
      data = {
        message: "Invalid Params On Link",
      };
      response.validation_error_message(data, res);
    }
  } else {
    data = {
      message: "Invalid Password Reset Link",
    };
    response.validation_error_message(data, res);
  }
};

exports.change_password = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const user = await authModel.findById(auth_user.id);
    if (!user) {
      const data = { message: "User not found." };
      return response.validation_error_message(data, res);
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      const data = { message: "Invalid old password." };
      return response.validation_error_message(data, res);
    }

    // Check if the old password and new password are the same
    if (oldPassword === newPassword) {
      const data = { message: "New password cannot be same as old password" };
      return response.validation_error_message(data, res);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashedPassword;
    await user.save();

    const updatedData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    const data = {
      message: "Password changed successfully.",
      updatedData: updatedData,
    };

    return response.success_message(data, res);
  } catch (err) {
    const data = { message: err.message };
    response.error_message(data, res);
  }
};
