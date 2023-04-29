const express = require("express");
const router = express.Router();
const homeController = require("../../../controller/api/v1/index");

router.get("/", homeController.getHome);

//user
router.use("/user", require("./user"));

module.exports = router;
