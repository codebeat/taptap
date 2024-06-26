var express = require("express");
var router = express.Router();

var tg = require("../../controllers/Tg");

router.post("/auth", tg.auth);

module.exports = router;