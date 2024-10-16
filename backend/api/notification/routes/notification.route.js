const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification.controller");

router.get("/getNotification", notificationController.notification);
router.post("/sendNotification", notificationController.sendFCMMessage);
router.get("/listNotification", notificationController.list);
router.delete("/deleteNotification", notificationController.delete);
router.put("/",notificationController.update);

module.exports = router;
