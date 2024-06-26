var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../middlewares/tg");
var Leaderboard = require("../../controllers/Leaderboard");

router.get("/allrank", tgMiddleware.tgauth_required, Leaderboard.allrank);



module.exports = router;