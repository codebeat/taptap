var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../middlewares/tg");
var Referral = require("../../controllers/Referral");

router.get("/list", tgMiddleware.tgauth_required, Referral.list);
router.post("/claim", tgMiddleware.tgauth_required, Referral.claim);
router.post("/claimall", tgMiddleware.tgauth_required, Referral.claimAll);


module.exports = router;