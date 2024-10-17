const mongoose = require("mongoose");
const userModel = require("../../api/auth/models/auth.model");
const bcrypt = require("bcryptjs");

exports.userSeeding = async () => {
  try {
    const userRecord = await userModel.findOne().lean();
    if (userRecord) {
      return;
    } else {
      // const hashedPassword = bcrypt.hashSync("Dgt@2023", 8);
      const hashedPasswordAdmin=bcrypt.hashSync("Lynns123@#", 8);

      const usersToCreate = [
        // {
        //   fullname: "Super Admin",
        //   status: "Active",
        //   email: "superadmin@lynnstechnologies.com",
        //   password: hashedPassword,
        //   role: "Super Admin",
        // },
        {
          fullname: "Admin",
          status: "Active",
          // email: "admin@example.com",
          email: "lynns@roshnroys.com",
          password: hashedPasswordAdmin,
          role: "Super Admin",
        }
      ];

      const userRec = await userModel.create(usersToCreate);

    }
  } catch (error) {
    console.log("error :", error);
  }
};
