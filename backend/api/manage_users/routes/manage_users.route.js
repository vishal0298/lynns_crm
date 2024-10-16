const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const verify = require("../../../verify.token");
const fs = require("fs");
const path = require("path");
const checkAccess = require("../../../middleware/permission.middleware");

const resizeImages = async (req, res, next) => {
  try {
    if (req.files) {
      await Promise.all(
        req.files.map(async (file) => {
          await sharp(file.path)
            .resize({ width: 40 })
            .toFile(file.path.replace(/(?=\.[^.]+$)/, "-resized"));

          // Delete the original image
          fs.unlinkSync(file.path);

          // Rename the resized image to the original filename
          fs.renameSync(
            file.path.replace(/(?=\.[^.]+$)/, "-resized"),
            file.path
          );
        })
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

var storage = multer.diskStorage({
  destination: async function (req, file, callback) {
    var token = req.headers.token;
    var result = await verify.verify_token(token);
    if (result.status == 200) {
      var dir =
        "./uploads/manage_users/" + result.details.id + "/" + req.body.userName;
      if (!fs.existsSync(dir)) {
        dir.split("/").reduce((directories, directory) => {
          directories += `${directory}/`;
          if (!fs.existsSync(directories)) {
            fs.mkdirSync(directories);
          }
          return directories;
        }, "");
      }
      callback(null, dir);
    } else {
      console.log("Invalid Token while file upload on User Images");
    }
  },
  filename: function (req, file, callback) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    callback(null, path.parse(file.originalname).name + "." + extension);
  },
});

const upload = multer({ storage: storage });

const manageUsersController = require("../controllers/manage_users.controller");
const manageUsersValidator = require("../validations/manage_users.validator");
// const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/create",
  upload.array("image"),
  resizeImages,
  checkAccess.checkAccess("user", "create"),
  manageUsersValidator.create,
  manageUsersController.create
);
router.put(
  "/:id",
  upload.array("image"),
  checkAccess.checkAccess("user", "update"),
  manageUsersValidator.update,
  manageUsersController.update
);
router.get(
  "/listUsers",
  checkAccess.checkAccess("user", "view"),
  manageUsersController.list
);

router.get(
  "/viewUser/:id",
  checkAccess.checkAccess("user", "view"),
  manageUsersController.view
);
router.patch(
  "/:id/softDelete",
  checkAccess.checkAccess("user", "delete"),
  manageUsersController.softDelete
);
router.post(
  "/delete_image",
  upload.none(),
  manageUsersValidator.del_img,
  manageUsersController.delete_image
);

module.exports = router;
