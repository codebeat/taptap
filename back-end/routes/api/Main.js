var express = require("express");
var router = express.Router();

var tgauthRouter = require("./Tg");
var gameRouter = require("./game"); //need to remove
var rewardRouter = require("./Reward");
var earnRouter = require("./Earn");
var referralRouter = require("./Referral");
var taskRouter = require("./Task");
var Leaderboard = require("./Leaderboard");

router.use("/tg", tgauthRouter);
router.use("/game", gameRouter); //need to remove
router.use("/reward", rewardRouter);
router.use("/earn", earnRouter);
router.use("/referral", referralRouter);
router.use("/task", taskRouter)
router.use("/leaderboard", Leaderboard);



module.exports = router;