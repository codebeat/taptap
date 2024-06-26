var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../middlewares/tg");
var earn = require("../../controllers/Earn");

router.get("/getscore", tgMiddleware.tgauth_required, earn.getscore);
router.post("/upscore", tgMiddleware.tgauth_required, earn.upscore);

module.exports = router;