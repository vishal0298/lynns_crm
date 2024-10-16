const emailSettingModel = require("../email_settings/models/email_settings.model");
var nodemailer = require("nodemailer");


exports.createTransporters = async () => {
    const emailSettings = await emailSettingModel.findOne().lean();

    const nodeTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailSettings.nodeFromEmail,
            pass: emailSettings.nodePassword,
        },
        debug: false,
    });

    const smtpTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailSettings.smtpFromEmail,
            pass: emailSettings.smtpPassword,
        },
        debug: false,
    });

    return {
        nodeTransporter,
        smtpTransporter,
    };
};



