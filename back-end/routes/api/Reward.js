var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../middlewares/tg");
var reward = require("../../controllers/reward");

router.get("/claim", tgMiddleware.tgauth_required, reward.claim);
router.get("/upgrade", tgMiddleware.tgauth_required, reward.upgrade);

module.exports = router;
