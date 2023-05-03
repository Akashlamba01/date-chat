const express = require("express");
const router = express.Router();

const homeController = require("../controller/index");

router.get("/", homeController.getHome);
router.use("/users", require("./user"));

module.exports = router;
