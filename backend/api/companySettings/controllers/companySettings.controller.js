const response = require("../../../response");
const verify = require("../../../verify.token");
const companySettingsModel = require("../models/companySetting.model");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

exports.updateCompanySetting = async (req, res) => {
  try {
    const request = req.body;
    const files = req.files;
    const authUser = verify.verify_token(req.headers.token).details;
    const companyRec = await companySettingsModel.findOne({
      userId: authUser.id,
    });
    let siteLogoPath = "";
    let faviconPath = "";
    let companyLogoPath = "";
    if (companyRec == null) {
      if (files.siteLogo) {
        siteLogoPath = files.siteLogo[0].path;
      }
      if (files.favicon) {
        faviconPath = files.favicon[0].path;
      }
      if (files.companyLogo) {
        companyLogoPath = files.companyLogo[0].path;
      }
      const rec = await companySettingsModel.create({
        companyName: request.companyName,
        addressLine1: request.addressLine1,
        addressLine2: request.addressLine2,
        city: request.city,
        state: request.state,
        country: request.country,
        pincode: request.pincode,
        email: request.email,
        phone: request.phone,
        siteLogo: siteLogoPath,
        favicon: faviconPath,
        companyLogo: companyLogoPath,
        userId: authUser.id,
      });
      let data = {
        message: "Company settings updated successfully",
        updatedData: rec,
      };
      response.success_message(data, res);
    } else {
      siteLogoPath = companyRec.siteLogo;
      if (files.siteLogo) {
        siteLogoPath = files.siteLogo[0].path;
        if (companyRec.siteLogo !== "" && fs.existsSync(companyRec.siteLogo)) {
          const rootDir = path.resolve("./");
          let oldImagePath = path.join(rootDir, companyRec.siteLogo);
          fs.unlinkSync(oldImagePath);
        }
      }
      faviconPath = companyRec.favicon;
      if (files.favicon) {
        faviconPath = files.favicon[0].path;
        if (companyRec.favicon !== "" && fs.existsSync(companyRec.favicon)) {
          const rootDir = path.resolve("./");
          let oldImagePath = path.join(rootDir, companyRec.favicon);
          fs.unlinkSync(oldImagePath);
        }
      }
      companyLogoPath = companyRec.companyLogo;
      if (files.companyLogo) {
        companyLogoPath = files.companyLogo[0].path;
        if (
          companyRec.companyLogo !== "" &&
          fs.existsSync(companyRec.companyLogo)
        ) {
          const rootDir = path.resolve("./");
          let oldImagePath = path.join(rootDir, companyRec.companyLogo);
          fs.unlinkSync(oldImagePath);
        }
      }
      const preferenceRec = await companySettingsModel.findOneAndUpdate(
        {
          userId: authUser.id,
        },
        {
          $set: {
            companyName: request.companyName,
            email: request.email,
            phone: request.phone,
            addressLine1: request.addressLine1,
            addressLine2: request.addressLine2,
            city: request.city,
            state: request.state,
            country: request.country,
            pincode: request.pincode,
            siteLogo: siteLogoPath,
            favicon: faviconPath,
            companyLogo: companyLogoPath,
            userId: authUser.id,
          },
        },
        { new: true }
      );
      if (preferenceRec) {
        if (preferenceRec.siteLogo !== "") {
          preferenceRec.siteLogo = `${process.env.DEVLOPMENT_BACKEND_URL}/${preferenceRec.siteLogo}`;
        }
        if (preferenceRec.favicon !== "") {
          preferenceRec.favicon = `${process.env.DEVLOPMENT_BACKEND_URL}/${preferenceRec.favicon}`;
        }
        if (preferenceRec.companyLogo !== "") {
          preferenceRec.companyLogo = `${process.env.DEVLOPMENT_BACKEND_URL}/${preferenceRec.companyLogo}`;
        }
        let data = {
          message: "Company settings updated successfully",
          updatedData: preferenceRec,
        };

        response.success_message(data, res);
      }
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.viewCompanySetting = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const preferenceRec = await companySettingsModel
      .findOne({
        userId: authUser.id,
      })
      .lean();
    if (preferenceRec == null) {
      const obj = {
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
      response.success_message(obj, res);
    } else {
      if (preferenceRec.siteLogo !== "") {
        preferenceRec.siteLogo = `${process.env.DEVLOPMENT_BACKEND_URL}/${preferenceRec.siteLogo}`;
      }
      if (preferenceRec.favicon !== "") {
        preferenceRec.favicon = `${process.env.DEVLOPMENT_BACKEND_URL}/${preferenceRec.favicon}`;
      }
      if (preferenceRec.companyLogo !== "") {
        preferenceRec.companyLogo = `${process.env.DEVLOPMENT_BACKEND_URL}/${preferenceRec.companyLogo}`;
      }

      response.success_message(preferenceRec, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};
